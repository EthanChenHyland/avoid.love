import sharp from 'sharp';
import fs from 'node:fs/promises';
await fs.mkdir('public/art',{recursive:true});
for (const name of ['hero-poppy','hero-cafe','hero-letters']) {
 const input=`art-source/${name}.png`;
 await sharp(input).resize({width:1920,withoutEnlargement:true}).webp({quality:88}).toFile(`public/art/${name}.webp`);
 await sharp(input).resize({width:1536,withoutEnlargement:true}).avif({quality:65}).toFile(`public/art/${name}.avif`);
 await sharp(input).resize(780,1100,{fit:'cover',position:name==='hero-poppy'?'right':'right'}).webp({quality:84}).toFile(`public/art/${name}-mobile.webp`);
}
// A compositing matte derived from the actual accepted photo, not drawn illustration.
// Keep the foreground lower petal only: type remains legible above its natural edge.
const {data,info}=await sharp('art-source/hero-poppy.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
for(let y=0;y<info.height;y++) for(let x=0;x<info.width;x++){
 const i=(y*info.width+x)*4; const r=data[i],g=data[i+1],b=data[i+2];
 const chroma=Math.max(0,Math.min(1,(r-Math.max(g,b)*1.7-12)/20));
 const depth=Math.max(0,Math.min(1,(y/info.height-.63)/.015));
 data[i+3]=Math.round(255*chroma*depth);
}
await sharp(data,{raw:info}).webp({quality:90}).toFile('public/art/poppy-foreground.webp');
await fs.mkdir('public/fonts',{recursive:true});
for (const [source,dest] of [
 ['node_modules/@fontsource/bodoni-moda/files/bodoni-moda-latin-400-normal.woff2','bodoni.woff2'],
 ['node_modules/@fontsource/bodoni-moda/files/bodoni-moda-latin-400-italic.woff2','bodoni-italic.woff2'],
 ['node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff2','manrope.woff2']]) await fs.copyFile(source,`public/fonts/${dest}`);
console.log('Accepted artwork and fonts prepared');
