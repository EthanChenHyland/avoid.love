import {scrollToChapter} from './qa-scroll.mjs';
import {chromium} from 'playwright';import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'}),report=[],points=[.0667,.16,.197,.205,.23,.255,.272,.31,.335,.42,.44,.54,.56,.5763,.600,.613,.6148,.65,.67,.75,.766,.77,.82,.84,.8759,.885,.917,.95,.963,.966];
for(const [width,height] of [[390,844],[639,734],[701,900],[1280,720]]){
 const page=await browser.newPage({viewport:{width,height}});await page.goto(process.env.QA_URL||'http://127.0.0.1:4188/');
 const sample=async at=>{await scrollToChapter(page,at);await page.waitForFunction(at=>Math.abs(+document.querySelector('#world').dataset.progress-at)<.0001,at);await page.waitForTimeout(150);return page.locator('#world').evaluate(c=>{const small=document.createElement('canvas');small.width=160;small.height=100;const ctx=small.getContext('2d');ctx.drawImage(c,0,0,160,100);return [...ctx.getImageData(0,0,160,100).data];});};
 const diff=(a,b)=>{let sum=0;for(let i=0;i<a.length;i++)if(i%4!==3)sum+=Math.abs(a[i]-b[i]);return sum/(a.length*.75*255)};
 for(const at of points){const before=await sample(at-.0003),after=await sample(at+.0003),reverse=await sample(at-.0003);report.push({width,at,forward:diff(before,after),reverse:diff(after,reverse)});}
 await page.close();
}await browser.close();await fs.mkdir('qa/boundary-audit',{recursive:true});await fs.writeFile('qa/boundary-audit/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report.sort((a,b)=>Math.max(b.forward,b.reverse)-Math.max(a.forward,a.reverse)).slice(0,16),null,2));
