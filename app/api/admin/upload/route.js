import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseAdmin';
import sharp from 'sharp';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    const slug = formData.get('slug') || 'general';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const hasBucket = buckets?.some((b) => b.name === 'product-images');
    if (!hasBucket) {
      await supabase.storage.createBucket('product-images', { public: true });
    }

    const uploadedUrls = [];

    for (const file of files) {
      if (typeof file === 'string') continue;
      let buffer = Buffer.from(await file.arrayBuffer());
      let ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      let mimeType = file.type || 'image/jpeg';

      // If file is large (> 1MB), optimize with sharp
      if (buffer.length > 1024 * 1024 && !file.type.includes('svg')) {
        try {
          buffer = await sharp(buffer)
            .resize({ width: 2048, height: 2048, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 85 })
            .toBuffer();
          ext = 'webp';
          mimeType = 'image/webp';
        } catch {
          // Fallback to original buffer
        }
      }

      const path = `products/${slug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(path, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(path);

      uploadedUrls.push(publicUrl);
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
