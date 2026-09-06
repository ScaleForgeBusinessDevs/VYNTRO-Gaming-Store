import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ products: data || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();

    if (!payload.name || !payload.slug || !payload.category) {
      return NextResponse.json(
        { error: 'Name, slug, and category are required' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    let { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select()
      .single();

    // If any column (like color_variants, size_pricing, collections) doesn't exist yet in Supabase schema cache, retry without it
    let attempts = 0;
    const safePayload = { ...payload };
    while (error && error.message && attempts < 5) {
      const match = error.message.match(/Could not find the '([^']+)' column/i);
      if (match && match[1]) {
        delete safePayload[match[1]];
        const retry = await supabase
          .from('products')
          .insert(safePayload)
          .select()
          .single();
        data = retry.data;
        error = retry.error;
        attempts++;
      } else if (
        error.message.toLowerCase().includes('collections') ||
        error.message.toLowerCase().includes('size_pricing') ||
        error.message.toLowerCase().includes('color_variants')
      ) {
        if (error.message.toLowerCase().includes('collections')) delete safePayload.collections;
        if (error.message.toLowerCase().includes('size_pricing')) delete safePayload.size_pricing;
        if (error.message.toLowerCase().includes('color_variants')) delete safePayload.color_variants;

        const retry = await supabase
          .from('products')
          .insert(safePayload)
          .select()
          .single();
        data = retry.data;
        error = retry.error;
        attempts++;
      } else {
        break;
      }
    }

    if (error) throw error;
    return NextResponse.json({ product: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
