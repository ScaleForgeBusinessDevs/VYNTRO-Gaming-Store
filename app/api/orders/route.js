import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseAdmin';

// Generate a short readable order number
function generateOrderNumber() {
  const ts   = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `VYN-${ts}-${rand}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer, items } = body;

    // --- Basic validation ---
    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address || !customer?.city) {
      return NextResponse.json({ error: 'Missing required customer fields' }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
    if (isPlaceholder) {
      const orderNumber = generateOrderNumber();
      console.warn(`[POST /api/orders] Demo mode: Generated simulated order ${orderNumber}`);
      return NextResponse.json({ order_number: orderNumber, demo: true }, { status: 201 });
    }

    const supabase = await createAdminClient();

    // --- Upsert customer (match on email) ---
    let customerId;
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', customer.email.toLowerCase())
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const { data: newCustomer, error: custErr } = await supabase
        .from('customers')
        .insert({
          name:    customer.name.trim(),
          email:   customer.email.toLowerCase().trim(),
          phone:   customer.phone.trim(),
          address: customer.address.trim(),
          city:    customer.city,
        })
        .select('id')
        .single();
      if (custErr) throw custErr;
      customerId = newCustomer.id;
    }

    // --- Calculate totals ---
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalCogs = 0; // Will be filled from product cost_price when we can fetch it
    const orderNumber = generateOrderNumber();

    // --- Create order ---
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_number:    orderNumber,
        customer_id:     customerId,
        status:          'Pending',
        payment_method:  'COD',
        subtotal,
        discount_amount: 0,
        total_amount:    subtotal,
        total_cogs:      totalCogs,
        profit_margin:   0,
        notes:           customer.notes?.trim() ?? '',
      })
      .select('id')
      .single();
    if (orderErr) throw orderErr;

    // --- Create order items + calculate COGS ---
    let realCogs = 0;
    const orderItems = await Promise.all(
      items.map(async (item) => {
        // Fetch cost price from products table for accurate COGS
        const realProductId = item.productId || item.id;
        let costPrice = 0;
        try {
          const { data: prod } = await supabase
            .from('products')
            .select('cost_price')
            .eq('id', realProductId)
            .single();
          if (prod) costPrice = prod.cost_price ?? 0;
        } catch {
          // Fallback
        }
        realCogs += costPrice * item.quantity;

        const displayName = item.variant
          ? `${item.name} (${item.variant}${item.variantDims ? ` - ${item.variantDims}` : ''})`
          : item.name;

        return {
          order_id:              order.id,
          product_id:            realProductId,
          product_name_snapshot: displayName,
          quantity:              item.quantity,
          unit_price:            item.price,
          unit_cost:             costPrice,
          line_total:            item.price * item.quantity,
        };
      })
    );

    const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
    if (itemsErr) throw itemsErr;

    // Update order with real COGS + profit margin
    const profitMargin = subtotal > 0 ? ((subtotal - realCogs) / subtotal) * 100 : 0;
    await supabase
      .from('orders')
      .update({ total_cogs: realCogs, profit_margin: profitMargin })
      .eq('id', order.id);

    // --- Send confirmation email (async, non-blocking) ---
    sendConfirmationEmail(customer, orderNumber, items, subtotal).catch((err) => {
      console.error('[Email] Failed to send confirmation:', err);
    });

    return NextResponse.json({ order_number: orderNumber }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/orders]', err);
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 });
  }
}

async function sendConfirmationEmail(customer, orderNumber, items, total) {
  if (!process.env.RESEND_API_KEY) return;
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const itemsHtml = items
    .map((i) => `<tr><td>${i.name}</td><td>× ${i.quantity}</td><td>PKR ${(i.price * i.quantity).toLocaleString()}</td></tr>`)
    .join('');

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'orders@vyntro.com',
    to:   customer.email,
    subject: `Order Confirmed — ${orderNumber} | VYNTRO`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #F5F3EF; background: #0A0A0C; padding: 40px 32px;">
        <h1 style="color: #E60012; font-size: 28px; margin-bottom: 8px;">Order Confirmed ✓</h1>
        <p style="color: #9A9A9F; margin-bottom: 24px;">Hi ${customer.name}, your order <strong style="color:#F5F3EF">${orderNumber}</strong> has been received!</p>
        <table width="100%" cellpadding="8" style="border-collapse: collapse; background: #131316; border-radius: 8px;">
          <thead><tr style="border-bottom: 1px solid #1F1F24;">
            <th align="left" style="color:#9A9A9F; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Product</th>
            <th align="left" style="color:#9A9A9F; font-size:12px;">Qty</th>
            <th align="left" style="color:#9A9A9F; font-size:12px;">Price</th>
          </tr></thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot><tr style="border-top: 1px solid #1F1F24;">
            <td colspan="2" style="font-weight:700; color:#FFFFFF;">Total</td>
            <td style="font-weight:700; color:#FFFFFF;">PKR ${total.toLocaleString()}</td>
          </tr></tfoot>
        </table>
        <div style="margin-top:24px; padding:16px; background:#131316; border-left: 3px solid #7CD98C; border-radius: 4px;">
          <p style="color:#7CD98C; font-weight:700; margin:0 0 4px;">Cash on Delivery</p>
          <p style="color:#9A9A9F; font-size:14px; margin:0;">Pay when your order arrives. Delivery to ${customer.city} in 3–5 business days.</p>
        </div>
        <p style="margin-top:24px; color:#5A5A62; font-size:13px;">Questions? WhatsApp us or reply to this email.<br>— Team VYNTRO</p>
      </div>
    `,
  });
}
