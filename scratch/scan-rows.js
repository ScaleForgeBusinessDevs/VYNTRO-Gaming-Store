const sharp = require('sharp');

async function scan() {
  const { data, info } = await sharp('public/hero-concept.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;

  // Let's inspect rows from 0 to 300 to see brightness profile
  console.log('Row brightness profile (top 350px):');
  for (let y = 0; y < 350; y += 10) {
    let maxVal = 0;
    let avgVal = 0;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      if (brightness > maxVal) maxVal = brightness;
      avgVal += brightness;
    }
    avgVal = Math.round(avgVal / width);
    if (y % 20 === 0 || maxVal > 80) {
      console.log(`y=${y}: max=${Math.round(maxVal)}, avg=${avgVal}`);
    }
  }
}
scan();
