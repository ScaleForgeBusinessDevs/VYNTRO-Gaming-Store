import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseAdmin';
import { createServerSupabase } from '@/lib/supabaseAdmin';

const VALID_STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

export async function GET(request, { params }) {
  const { id } = await params;
  const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
  if (isPlaceholder) {
    return NextResponse.json({
      id,
      order_number: 'VYN-DEMO-001',
      status: 'Pending',
      payment_method: 'COD',
      subtotal: 2499,
      total_amount: 2499,
      total_cogs: 900,
      profit_margin: 64.0,
      notes: 'Please call before delivery',
      created_at: new Date().toISOString(),
      customers: {
        name: 'Ahmed Khan',
        email: 'ahmed@example.com',
        phone: '03001234567',
        address: 'House 12, Block B, DHA Phase 5',
        city: 'Karachi'
      },
      order_items: [
        {
          id: 'item-1',
          product_name_snapshot: 'Midnight Black XL',
          quantity: 1,
          unit_price: 2499,
          unit_cost: 900,
          line_total: 2499,
        }
      ]
    });
  }

  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers (*),
      order_items (*, products (name, slug))
    `)
    .eq('id', id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const { status, notes } = body;

  const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
  if (isPlaceholder) {
    return NextResponse.json({ id, status, notes, updated_at: new Date().toISOString() });
  }

  // Auth guard — only admin sessions can update orders
  const authClient = await createServerSupabase();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const supabase = await createAdminClient();

  // Fetch current order to know its current status and items
  const { data: currentOrder, error: fetchErr } = await supabase
    .from('orders')
    .select('status, order_items(product_id, quantity)')
    .eq('id', id)
    .single();

  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 404 });

  const prevStatus = currentOrder.status;

  // Build update payload
  const updatePayload = {};
  if (status) updatePayload.status = status;
  if (notes !== undefined) updatePayload.notes = notes;
  updatePayload.updated_at = new Date().toISOString();

  const { data: updated, error: updateErr } = await supabase
    .from('orders')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  // --- Stock logic ---
  // Moving to Confirmed → deduct stock
  if (status === 'Confirmed' && prevStatus !== 'Confirmed') {
    for (const item of currentOrder.order_items) {
      await supabase.rpc('decrement_stock', {
        p_product_id: item.product_id,
        p_quantity:   item.quantity,
      });
    }
  }

  // Moving from Confirmed+ to Cancelled → restore stock
  const wasConfirmedOrLater = ['Confirmed', 'Shipped', 'Delivered'].includes(prevStatus);
  if (status === 'Cancelled' && wasConfirmedOrLater) {
    for (const item of currentOrder.order_items) {
      await supabase.rpc('increment_stock', {
        p_product_id: item.product_id,
        p_quantity:   item.quantity,
      });
    }
  }

  return NextResponse.json(updated);
}
