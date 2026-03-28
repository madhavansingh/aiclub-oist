import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dirs = [
  'public/membersIMG',
  'public/eventImg',
  'src/assets',
  'public/PublicAssets'
];

async function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await processDirectory(filePath);
    } else if (file.match(/\.(png|jpe?g|webp)$/i)) {
      if (stat.size > 500 * 1024) { // Only process if larger than 500KB
        console.log(`Processing: ${filePath} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
        const tempPath = filePath + '.tmp.webp';
        try {
          await sharp(filePath)
            .resize({ width: 800, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(tempPath);
          fs.renameSync(tempPath, filePath);
          console.log(`✅ Optimized: ${file}`);
        } catch (e) {
          console.error(`❌ Failed: ${file}`, e);
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
      }
    }
  }
}

async function run() {
  for (const dir of dirs) {
    await processDirectory(dir);
  }
  console.log("Optimization complete!");
}

run();
