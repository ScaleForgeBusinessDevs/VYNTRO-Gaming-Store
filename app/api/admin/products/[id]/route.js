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

    if (error && error.message && (error.message.toLowerCase().includes('collections') || error.message.toLowerCase().includes('size_pricing'))) {
      const safePayload = { ...payload };
      if (error.message.toLowerCase().includes('collections')) delete safePayload.collections;
      if (error.message.toLowerCase().includes('size_pricing')) delete safePayload.size_pricing;

      const retry = await supabase
        .from('products')
        .update(safePayload)
        .eq('id', id)
        .select()
        .single();
      data = retry.data;
      error = retry.error;
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

    if (error && error.message && (error.message.toLowerCase().includes('collections') || error.message.toLowerCase().includes('size_pricing'))) {
      const safePartial = { ...partial };
      if (error.message.toLowerCase().includes('collections')) delete safePartial.collections;
      if (error.message.toLowerCase().includes('size_pricing')) delete safePartial.size_pricing;

      const retry = await supabase
        .from('products')
        .update(safePartial)
        .eq('id', id)
        .select()
        .single();
      data = retry.data;
      error = retry.error;
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
