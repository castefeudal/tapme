import sharp from "sharp";
import { join } from "node:path";
const root = process.argv[2] || ".";
for (const [source, name, width] of [
  ["накачанный я.png", "hero-portrait", 1200],
  ["груз.jpeg", "fitness", 600],
  ["photo_2022-05-14_20-50-41.jpg", "portrait-editorial", 1280],
  ["золото.png", "markovmade", 500],
  ["каста феодалов.png", "caste", 240],
]) {
  await sharp(join(root, source))
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 83 })
    .toFile("public/media/" + name + ".webp");
}
for (const [suffix, width, quality] of [
  ["small", 600, 83],
  ["mobile", 700, 85],
  ["medium", 800, 83],
]) {
  await sharp("public/media/hero-portrait.webp")
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(`public/media/hero-portrait-${suffix}.webp`);
}
