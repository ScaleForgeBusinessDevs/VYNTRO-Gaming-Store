const sharp = require('sharp');

async function trimMousepad() {
  const meta = await sharp('Assets/Mousepad_Nobg.png').metadata();
  console.log('Original Mousepad dimensions:', meta.width, 'x', meta.height);

  // Trim transparent pixels
  const trimmed = await sharp('Assets/Mousepad_Nobg.png')
    .trim()
    .toFile('public/mousepad-trimmed.png');

  console.log('Trimmed Mousepad:', trimmed);
}
trimMousepad();
