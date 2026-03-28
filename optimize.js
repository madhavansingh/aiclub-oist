import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = 'public';

async function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await processDirectory(filePath);
    } else if (file.match(/\.(png|jpe?g|webp)$/i)) {
      const isOriginalWebp = file.toLowerCase().endsWith('.webp');
      console.log(`Processing: ${filePath} (${(stat.size / 1024).toFixed(2)} KB)`);
      const tempPath = filePath + '.tmp.webp';
      
      try {
        const image = sharp(filePath);
        const metadata = await image.metadata();
        
        let transform = image;
        
        // Prevent huge resolutions while keeping things sharp
        if (metadata.width > 1200) {
           transform = transform.resize({ width: 1200, withoutEnlargement: true });
        }

        // Apply aggressive compression targeting ~90% reduction
        // For WebP: quality between 50-70 with high effort yields massive savings with little visual loss
        await transform
          .webp({ quality: 60, effort: 6 }) 
          .toFile(tempPath);

        const newStat = fs.statSync(tempPath);
        const saved = ((stat.size - newStat.size) / stat.size * 100).toFixed(2);
        
        // Only replace if the new file is smaller
        if (newStat.size < stat.size) {
           fs.renameSync(tempPath, filePath);
           console.log(`✅ Optimized: ${file} | Saved: ${saved}% (${(newStat.size / 1024).toFixed(2)} KB)`);
        } else {
           fs.unlinkSync(tempPath);
           console.log(`⏭️ Skipped: ${file} (Already optimal)`);
        }
      } catch (e) {
        console.error(`❌ Failed: ${file}`, e);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      }
    }
  }
}

async function run() {
  console.log("Starting aggressive compression for all images in public folder...");
  await processDirectory(publicDir);
  console.log("Compression complete!");
}

run();
