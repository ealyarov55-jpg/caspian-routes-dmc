import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const imagesDir = './public/images';
const files = readdirSync(imagesDir);

for (const file of files) {
  if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;
  const filePath = join(imagesDir, file);
  const stats = statSync(filePath);
  
  // Сжимаем только файлы больше 300KB
  if (stats.size < 300 * 1024) continue;
  
  console.log(`Compressing: ${file} (${Math.round(stats.size/1024)}KB)`);
  
  await sharp(filePath)
    .resize(1200, 800, { fit: 'cover', withoutEnlargement: true })
    .jpeg({ quality: 75, progressive: true })
    .toFile(filePath + '.tmp');
  
  const { renameSync, unlinkSync } = await import('fs');
  unlinkSync(filePath);
  renameSync(filePath + '.tmp', filePath);
  
  const newStats = statSync(filePath);
  console.log(`Done: ${Math.round(newStats.size/1024)}KB`);
}