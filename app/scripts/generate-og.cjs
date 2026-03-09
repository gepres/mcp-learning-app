// scripts/generate-og.cjs
// Convierte public/og-image.svg → public/og-image.png (1200×630)
// Se ejecuta automáticamente antes del build: "prebuild"

const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const src = path.join(__dirname, '../public/og-image.svg')
const dest = path.join(__dirname, '../public/og-image.png')

sharp(fs.readFileSync(src))
  .resize(1200, 630)
  .png({ quality: 95, compressionLevel: 8 })
  .toFile(dest)
  .then(i => console.log(`✅ og-image.png generado: ${i.width}×${i.height} (${(fs.statSync(dest).size / 1024).toFixed(0)} KB)`))
  .catch(e => { console.error('❌ Error generando og-image.png:', e.message); process.exit(1) })
