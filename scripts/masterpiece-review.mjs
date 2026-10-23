import sharp from 'sharp';
const tiles=[];let index=0;
for(const width of [390,1440])for(const lang of ['ru','en'])for(const theme of ['dark','light'])for(const mode of ['BODY','MIND','SYSTEM']){
 const file=`docs/evidence/master-${width}-${lang}-${theme}-${mode}.png`;
 const tile=await sharp(file).resize(300,360,{fit:'contain',background:'#d7d3cb'}).png().toBuffer();
 tiles.push({input:tile,left:(index%4)*300,top:Math.floor(index/4)*360});index++;
}
await sharp({create:{width:1200,height:2160,channels:3,background:'#d7d3cb'}}).composite(tiles).png().toFile('docs/evidence/masterpiece-scenes.png');
