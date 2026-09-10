import {scrollToChapter} from './qa-scroll.mjs';
import {chromium} from 'playwright';import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'});await fs.mkdir('qa/mobile-handoffs',{recursive:true});const report=[];
for(const [width,height] of [[320,568],[390,844],[600,800],[700,900],[701,900],[768,1024],[844,390]]){
 const page=await browser.newPage({viewport:{width,height},hasTouch:width<=700});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.QA_URL||'http://127.0.0.1:4188/');
 for(const at of [.16,.185,.1955,.95,.966,.97,.982,1,.982,.95,.185]){
 await scrollToChapter(page,at);await page.waitForFunction(p=>Math.abs(+document.querySelector('#world').dataset.progress-p)<.0002,at);await page.waitForTimeout(450);
 if(at===1){await page.mouse.move(width-1,height-1);await page.waitForTimeout(500)}
 const exposed=await page.locator('#world').evaluate(canvas=>{const {width:w,height:h}=canvas,d=canvas.getContext('2d').getImageData(0,0,w,h).data;let exact=0,total=0;const check=(x,y)=>{const i=(y*w+x)*4;total++;if(d[i]===16&&d[i+1]===27&&d[i+2]===29)exact++};for(let x=0;x<w;x++){check(x,0);check(x,h-1)}for(let y=0;y<h;y++){check(0,y);check(w-1,y)}return exact/total});
 if(exposed>.05)throw Error(`Exposed canvas edge ${width} ${at}: ${exposed}`);report.push({width,height,at,exposed});
 if([.185,.966,1].includes(at))await page.screenshot({path:`qa/mobile-handoffs/${width}-${at}.png`});
 }if(errors.length)throw Error(errors.join());await page.close();
}
// Late portrait art must not erase the outgoing scene while its decode is pending.
const page=await browser.newPage({viewport:{width:390,height:844}});await page.route('**/art/love-morning-mobile.webp',async route=>{await new Promise(r=>setTimeout(r,1600));await route.continue()});await page.goto(process.env.QA_URL||'http://127.0.0.1:4188/');await scrollToChapter(page,.9);await page.waitForTimeout(600);await page.evaluate(()=>scrollTo(0,(document.querySelector('.scroll-track').offsetHeight-innerHeight)));await page.waitForTimeout(500);await page.screenshot({path:'qa/mobile-handoffs/late-ending.png'});await page.waitForTimeout(1600);await page.screenshot({path:'qa/mobile-handoffs/loaded-ending.png'});await page.close();await browser.close();await fs.writeFile('qa/mobile-handoffs/edges.json',JSON.stringify(report,null,2));console.log(`${report.length} forward/reverse samples passed; late ending captured`);
