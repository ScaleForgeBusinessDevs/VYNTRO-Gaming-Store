const sharp = require('sharp');

async function cleanNavbar() {
  const img = sharp('public/hero-concept.png');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const width = info.width;

  // Let's create a copy buffer
  const outData = Buffer.from(data);

  // In hero-concept.png, rows 0 to 40 are the dark smoky ceiling.
  // Rows 45 to 75 have the mock navbar text/icons.
  // Rows 80 to 140 are the dark smoky wall above the neon letters.
  // Let's interpolate or sample from row 35 and row 90, or smoothly blend rows 85-95 upward into 0-85!
  
  // Let's inspect average color at row 20 and row 100 for each x
  for (let y = 0; y < 85; y++) {
    const t = y / 85; // 0 to 1
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      // Use row 90-100 sample with subtle gradient toward row 10
      const refIdx1 = (15 * width + x) * 3;
      const refIdx2 = (92 * width + x) * 3;
      
      outData[idx] = Math.round(data[refIdx1] * (1 - t) + data[refIdx2] * t);
      outData[idx+1] = Math.round(data[refIdx1+1] * (1 - t) + data[refIdx2+1] * t);
      outData[idx+2] = Math.round(data[refIdx1+2] * (1 - t) + data[refIdx2+2] * t);
    }
  }

  await sharp(outData, { raw: { width: info.width, height: info.height, channels: 3 } })
    .png()
    .toFile('public/hero-clean.png');

  console.log('Created public/hero-clean.png');
}
cleanNavbar();
