const sharp = require('sharp');
const path = require('path');

async function run() {
  const metadata = await sharp('public/hero-concept.png').metadata();
  console.log('Metadata:', metadata);
}
run();
