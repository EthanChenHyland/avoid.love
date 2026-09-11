import {chromium} from 'playwright';
import {scrollToChapter} from './qa-scroll.mjs';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'});await fs.mkdir('qa/finale',{recursive:true});const report=[];
for(const [width,height] of [[390,844],[1280,720]]){
 const page=await browser.newPage({viewport:{width,height},hasTouch:width<700}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.QA_URL||'http://127.0.0.1:4188/');
 const go=async p=>{await scrollToChapter(page,p);await page.waitForFunction(p=>Math.abs(+document.querySelector('#world').dataset.progress-p)<.0002,p);};
 await go(1);await page.waitForTimeout(1700);await page.screenshot({path:`qa/finale/${width}-gather.png`});await page.waitForTimeout(6500);await page.screenshot({path:`qa/finale/${width}-bloom.png`});
 const draws=()=>page.evaluate(async()=>{const c=document.querySelector('#world').getContext('2d'),fill=c.fillRect;let n=0;c.fillRect=function(...args){n++;return fill.apply(this,args)};await new Promise(r=>setTimeout(r,600));c.fillRect=fill;return n;});
 await page.waitForTimeout(12000);const loop=await draws();if(!loop)throw Error('Finale stopped after one cycle');
 await go(.992);await page.waitForTimeout(1600);const away=await draws();if(away)throw Error('Finale redraws outside ending');
 await go(1);await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(1600);const reduced=await draws();if(reduced)throw Error('Reduced motion finale still running');
 if(errors.length)throw Error(errors.join());report.push({width,height,loop,away,reduced,errors});await page.close();
}await browser.close();await fs.writeFile('qa/finale/report.json',JSON.stringify(report,null,2));console.log(report);
