import sharp from 'sharp';
import { mkdir,copyFile } from 'node:fs/promises';
await mkdir('docs/signature-before',{recursive:true});
await sharp('public/media/hero-portrait.webp').resize(800).webp({quality:85}).toFile('public/media/hero-portrait-medium.webp');
// Original supplied portrait; no synthetic portrait or retouching.
const portrait=await sharp('public/media/hero-portrait.webp').resize(620,630,{fit:'cover',position:'centre'}).toBuffer();
const typography=Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#131313"/><text x="66" y="76" fill="#c4a57a" font-size="18" font-family="Arial" letter-spacing="3">PERSONAL EDITION / 01</text><text x="60" y="233" fill="#f2efe9" font-size="87" font-family="Arial" font-weight="bold" letter-spacing="-4">PAVEL</text><text x="60" y="328" fill="#f2efe9" font-size="87" font-family="Arial" font-weight="bold" letter-spacing="-4">MARKOV</text><path d="M66 387H492" stroke="#655747"/><text x="66" y="441" fill="#c4a57a" font-size="25" font-family="Georgia">Training. Nutrition. Projects.</text><text x="66" y="551" fill="#b4afa6" font-size="17" font-family="Arial">castefeudal.github.io/tapme</text></svg>`);
await sharp(typography).composite([{input:portrait,left:580,top:0}]).jpeg({quality:90,mozjpeg:true}).toFile('public/media/signature-og.jpg');
await copyFile('node_modules/@fortawesome/free-brands-svg-icons/LICENSE.txt','docs/font-awesome-license.txt');
await copyFile('node_modules/@fontsource/noto-serif/LICENSE','docs/noto-serif-license.txt');
