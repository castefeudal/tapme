import sharp from 'sharp';import {copyFile} from 'node:fs/promises';
const files=[];for(const lang of ['ru','en'])for(const theme of ['dark','light'])for(const width of [1440,768,390,320])files.push(`after-${width}-${lang}-${theme}.png`);
const tiles=[];for(let n=0;n<files.length;n++){const path='docs/evidence/'+files[n];const m=await sharp(path).metadata();const tile=await sharp(path).extract({left:0,top:0,width:m.width,height:Math.min(m.height,1100)}).resize(300,420,{fit:'contain',background:'#ddd7ce'}).png().toBuffer();tiles.push({input:tile,left:(n%4)*300,top:Math.floor(n/4)*420})}
await sharp({create:{width:1200,height:1680,channels:3,background:'#ddd7ce'}}).composite(tiles).png().toFile('docs/evidence/cover-matrix.png');
for(const [source,target] of [['after-1440-ru-dark.png','after-desktop.png'],['after-390-ru-dark.png','after-mobile.png']])await copyFile('docs/evidence/'+source,'docs/'+target);
console.log(JSON.stringify(await Promise.all(['docs/before/desktop.png','docs/before/mobile.png','docs/after-desktop.png','docs/after-mobile.png'].map(async path=>{const m=await sharp(path).metadata();return {path,width:m.width,height:m.height}}))));
