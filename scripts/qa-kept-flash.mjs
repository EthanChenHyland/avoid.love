import {scrollToChapter} from './qa-scroll.mjs';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome'});
try {
 for(const [width,height] of [[390,844],[1280,720]]) {
  const page=await browser.newPage({viewport:{width,height}});
  await page.route('**/frames/**',async route=>{await new Promise(r=>setTimeout(r,120));await route.continue()});
  await page.goto(process.env.QA_URL||'http://127.0.0.1:4188/');
  const go=async at=>{await scrollToChapter(page,at);await page.waitForTimeout(1100)};
  await go(.803);
  await page.waitForFunction(()=>document.querySelector('#world').dataset.film==='kept'&&+document.querySelector('#world').dataset.frame>=0);
  await page.evaluate(()=>{window.flashSamples=[];window.flashObserver=new MutationObserver(()=>{const d=document.querySelector('#world').dataset;if(d.film==='kept'&&+d.progress>.75&&+d.progress<.82)window.flashSamples.push({p:+d.progress,frame:+d.frame})});window.flashObserver.observe(document.querySelector('#world'),{attributes:true,attributeFilter:['data-progress','data-frame']})});
  for(const at of [.785,.76,.785,.803,.815,.835,.815,.803,.785,.76,.803])await go(at);
  const samples=await page.evaluate(()=>{window.flashObserver.disconnect();return window.flashSamples});
  const flashes=samples.filter(s=>s.frame<0);
  assert.equal(flashes.length,0,`${width}: discarded visible drawer frames: ${JSON.stringify(flashes.slice(0,8))}`);
  console.log(`${width}: ${samples.length} drawer renders retain decoded footage through forward/reverse scrolling with delayed requests`);
  await page.close();
 }
} finally {await browser.close()}
