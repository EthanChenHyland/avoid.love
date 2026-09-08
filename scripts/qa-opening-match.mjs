import {chromium} from 'playwright';
const browser=await chromium.launch({channel:'chrome'}),report=[];
for(const [width,height] of [[320,568],[390,844],[639,734],[700,900],[701,900],[1280,720]]){
 const page=await browser.newPage({viewport:{width,height}});await page.goto(process.env.QA_URL||'http://127.0.0.1:4188/');
 const sample=async at=>{await page.evaluate(at=>scrollTo(0,at*(document.querySelector('.scroll-track').offsetHeight-innerHeight)),at);await page.waitForTimeout(750);return page.locator('#world').evaluate(c=>{const list=window.__joinSamples??=[];list.push(c.getContext('2d').getImageData(0,0,c.width,c.height).data);return list.length-1;});};
 const before=await sample(.0666),after=await sample(.0668),reverse=await sample(.0666);
 const diff=(a,b)=>page.evaluate(([a,b])=>{const x=window.__joinSamples[a],y=window.__joinSamples[b];let sum=0;for(let i=0;i<x.length;i++)if(i%4!==3)sum+=Math.abs(x[i]-y[i]);return sum/(x.length*.75*255);},[a,b]);
 // Original shared frames differ slightly in encoding; reject crop resets, not that measured residual.
 const forward=await diff(before,after),back=await diff(after,reverse);if(forward>.012||back>.012)throw Error(JSON.stringify({width,forward,back}));report.push({width,forward,reverse:back});await page.close();
}await browser.close();console.log(report);
