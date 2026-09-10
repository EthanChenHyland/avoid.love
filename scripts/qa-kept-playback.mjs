import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome'});
try{for(const [width,height] of [[390,844],[1280,720]]){
 const page=await browser.newPage({viewport:{width,height}});await page.goto(process.env.QA_URL||'http://127.0.0.1:4188/');
 const go=async at=>{await page.evaluate(at=>scrollTo(0,at*(document.querySelector('.scroll-track').offsetHeight-innerHeight)),at);await page.waitForTimeout(1000)};
 const frame=()=>page.locator('#world').evaluate(e=>+e.dataset.frame);
 await go(.785);assert.equal(await frame(),0,'Drawer must wait for What stayed');await page.waitForTimeout(500);assert.equal(await frame(),0);
 await go(.803);const start=await frame(),y=await page.evaluate(()=>scrollY);assert.ok(start<30);
 await page.waitForTimeout(1800);assert.ok(await frame()>start+10,'Film must advance while scroll is stationary');assert.equal(await page.evaluate(()=>scrollY),y);
 await page.waitForFunction(()=>+document.querySelector('#world').dataset.frame===90,{},{timeout:15000});
 await go(.785);assert.equal(await frame(),90,'Reverse handoff must retain the displayed frame');
 await go(.85);await go(.785);assert.equal(await frame(),0,'New visit begins from the first frame');
 await page.emulateMedia({reducedMotion:'reduce'});await go(.803);assert.equal(await page.locator('#world').getAttribute('data-film'),'');
 console.log(`${width}: delayed chapter start, stationary playback, held handoff, replay and reduced motion pass`);await page.close();
}}finally{await browser.close()}
