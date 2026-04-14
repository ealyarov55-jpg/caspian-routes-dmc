import sharp from "sharp";
import { readdirSync, renameSync } from "fs";
import { join } from "path";

const dir = "./public/images";
const files = readdirSync(dir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));

for (const file of files) {
  const input = join(dir, file);
  const output = join(dir, file.replace(/\.(jpg|jpeg|png)$/i, "-opt.jpg"));
  await sharp(input)
    .resize(1200, null, { withoutEnlargement: true })
    .jpeg({ quality: 75 })
    .toFile(output);
  console.log(`✓ ${file} → оптимизировано`);
}

console.log("Готово! Проверь папку public/images/");