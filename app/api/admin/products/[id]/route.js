import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseAdmin';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const payload = await request.json();

    const supabase = getServiceSupabase();
    let { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
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
          .update(safePayload)
          .eq('id', id)
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
          .update(safePayload)
          .eq('id', id)
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
    return NextResponse.json({ product: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const partial = await request.json();

    const supabase = getServiceSupabase();
    let { data, error } = await supabase
      .from('products')
      .update(partial)
      .eq('id', id)
      .select()
      .single();

    let attempts = 0;
    const safePartial = { ...partial };
    while (error && error.message && attempts < 5) {
      const match = error.message.match(/Could not find the '([^']+)' column/i);
      if (match && match[1]) {
        delete safePartial[match[1]];
        const retry = await supabase
          .from('products')
          .update(safePartial)
          .eq('id', id)
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
        if (error.message.toLowerCase().includes('collections')) delete safePartial.collections;
        if (error.message.toLowerCase().includes('size_pricing')) delete safePartial.size_pricing;
        if (error.message.toLowerCase().includes('color_variants')) delete safePartial.color_variants;

        const retry = await supabase
          .from('products')
          .update(safePartial)
          .eq('id', id)
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
    return NextResponse.json({ product: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const supabase = getServiceSupabase();
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
