import {scrollToChapter} from './qa-scroll.mjs';
import {keptFilmProgress} from '../src/timeline.mjs';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome'});
try{for(const [width,height] of [[390,844],[1280,720]]){
 const page=await browser.newPage({viewport:{width,height}});await page.goto(process.env.QA_URL||'http://127.0.0.1:4188/');
 const go=async at=>{await scrollToChapter(page,at);await page.waitForFunction(at=>Math.abs(+document.querySelector('#world').dataset.progress-at)<.00005,at);await page.waitForTimeout(500)};
 const frame=()=>page.locator('#world').evaluate(e=>+e.dataset.frame);
 for(const at of [.785,.798]){await go(at);assert.equal(await frame(),0,'Entry holds first frame')}
 for(const at of [.802,.8065,.811,.814,.818,.811,.8065,.802]){
  await go(at);const expected=Math.round(keptFilmProgress(at)*90);
  await page.waitForFunction(expected=>+document.querySelector('#world').dataset.frame===expected,expected);
  if(at<.814)assert.ok(await page.locator('#kept-copy').evaluate(e=>+getComputedStyle(e).opacity)>.99,'Motion must occur under fully visible chapter copy');
  await page.waitForTimeout(400);assert.equal(await frame(),expected,'No timed motion after scrolling stops');
 }
 await go(.785);assert.equal(await frame(),0);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.documentElement.dataset.still==='true');await page.waitForTimeout(100);await go(.803);assert.equal(await page.locator('#world').getAttribute('data-film'),'');
 console.log(`${width}: entry hold, visible scroll animation, stationary hold, exit hold, reverse and reduced motion pass`);await page.close();
}}finally{await browser.close()}
