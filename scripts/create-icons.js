const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const toIco = require('to-ico');

// Path to your source image
const sourcePath = path.join(__dirname, '../assets/pic-bahenshree.jpg');

// Create Windows icon
async function createWindowsIcon() {
  try {
    // Resize to common icon sizes with high quality settings
    const sizes = [16, 24, 32, 48, 64, 128, 256];
    const resizedBuffers = await Promise.all(
      sizes.map(async size => {
        const buffer = await sharp(sourcePath)
          .resize(size, size, {
            fit: sharp.fit.contain,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
            kernel: sharp.kernel.lanczos3,
            position: 'center'
          })
          .png({
            quality: 100,
            compressionLevel: 9,
            palette: true
          })
          .toBuffer();
        return buffer;
      })
    );
    
    const icoBuffer = await toIco(resizedBuffers);
    fs.writeFileSync(path.join(__dirname, '../assets/icon.ico'), icoBuffer);
    console.log('✓ Windows icon created');
  } catch (err) {
    console.error('Error creating Windows icon:', err);
  }
}

// For macOS you'll need a separate tool like iconutil (macOS only)
// For this example, let's create a high-quality PNG for Linux
async function createLinuxIcon() {
  try {
    await sharp(sourcePath)
      .resize(512, 512, {
        fit: sharp.fit.contain,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        kernel: sharp.kernel.lanczos3,
        position: 'center'
      })
      .png({
        quality: 100,
        compressionLevel: 9,
        palette: true
      })
      .toFile(path.join(__dirname, '../assets/icon.png'));
    console.log('✓ Linux icon created');
  } catch (err) {
    console.error('Error creating Linux icon:', err);
  }
}

// Run the conversions
async function run() {
  await createWindowsIcon();
  await createLinuxIcon();
  console.log('For macOS .icns creation, use a tool like https://cloudconvert.com/png-to-icns');
}

run();