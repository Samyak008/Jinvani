const path = require('path');
const fs = require('fs');
// png-to-ico is ESM-only; use dynamic import from CommonJS

// Input PNG and output ICO paths
const pngPath = path.join(__dirname, '..', 'assets', 'icon.png');
const icoPath = path.join(__dirname, '..', 'assets', 'icon.ico');

async function run() {
  try {
    if (!fs.existsSync(pngPath)) {
      console.error(`Missing PNG at ${pngPath}. Please add a square PNG and rerun.`);
      process.exit(1);
    }
  const pngToIco = (await import('png-to-ico')).default;
  const buf = await pngToIco(pngPath);
    fs.writeFileSync(icoPath, buf);
    console.log(`✓ Wrote ICO: ${icoPath}`);
  } catch (err) {
    console.error('Failed to generate ICO from PNG:', err);
    process.exit(1);
  }
}

run();
