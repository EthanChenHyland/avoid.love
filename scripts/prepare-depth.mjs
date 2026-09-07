import sharp from 'sharp';
// Low-frequency depth mattes from the accepted images. No regenerated artwork.
for(const scene of ['little-things','love-morning'])for(const suffix of ['', '-mobile']){
const {data,info}=await sharp(`public/art/${scene}${suffix}.webp`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const start=scene==='love-morning'?(suffix?.64:.52):.52;const t=Math.max(0,Math.min(1,(y/info.height-start)/.20));data[(y*info.width+x)*4+3]=Math.round(t*t*(3-2*t)*255)}
await sharp(data,{raw:info}).webp({quality:88}).toFile(`public/art/${scene}-depth${suffix}.webp`);
}
