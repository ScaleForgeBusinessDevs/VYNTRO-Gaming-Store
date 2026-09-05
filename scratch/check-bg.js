const sharp = require('sharp');

async function checkBg() {
  const meta = await sharp('public/hero-bg.png').metadata();
  console.log('hero-bg.png meta:', meta);

  const { data, info } = await sharp('public/hero-bg.png')
    .resize(1536, 1024)
    .raw()
    .toBuffer({ resolveWithObject: true });

  console.log('Top row sample of hero-bg:', data[0], data[1], data[2]);
  console.log('y=60 sample of hero-bg:', data[(60 * 1536 + 768) * 3], data[(60 * 1536 + 768) * 3 + 1], data[(60 * 1536 + 768) * 3 + 2]);
}
checkBg();
