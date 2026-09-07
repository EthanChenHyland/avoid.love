import {chromium} from 'playwright';import sharp from 'sharp';import fs from 'node:fs/promises';
const b=await chromium.launch({channel:'chrome'}),out=[];await fs.mkdir('qa/cuts',{recursive:true});
for(const width of [1280,390]){const p=await b.newPage({viewport:{width,height:width===390?844:720}});await p.goto('http://127.0.0.1:4175/');
for(const at of [.0667,.0805,.1955,.23,.255,.265,.31,.335,.42,.44,.54,.56,.5763,.6148,.65,.67,.75,.77,.82,.84,.8785,.885,.95,.966,.97]){
const pictures=[];for(const offset of [-.0003,.0003]){const target=at+offset;await p.evaluate(at=>scrollTo({top:at*(document.querySelector('.scroll-track').offsetHeight-innerHeight),behavior:'instant'}),target);await p.waitForFunction(at=>Math.abs(+document.querySelector('#world').dataset.progress-at)<.0002,target);await p.waitForTimeout(350);pictures.push(await p.locator('#world').screenshot())}
const raw=await Promise.all(pictures.map(x=>sharp(x).resize(256,144).removeAlpha().raw().toBuffer()));let diff=0;for(let i=0;i<raw[0].length;i++)diff+=Math.abs(raw[0][i]-raw[1][i]);const mean=diff/raw[0].length/255;out.push({width,at,mean});if(mean>.025)for(let i=0;i<2;i++)await fs.writeFile(`qa/cuts/${width}-${at}-${i}.png`,pictures[i]);
}await p.close()}
await b.close();await fs.writeFile('qa/cuts/report.json',JSON.stringify(out,null,2));console.log(JSON.stringify(out.sort((a,b)=>b.mean-a.mean).slice(0,12),null,2));
