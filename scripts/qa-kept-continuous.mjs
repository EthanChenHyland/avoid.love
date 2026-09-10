import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {scrollToChapter} from './qa-scroll.mjs';
const browser=await chromium.launch({channel:'chrome'});
try {for(const [width,height] of [[390,844],[1280,720]]){
 const page=await browser.newPage({viewport:{width,height}});
 await page.route('**/frames/**',async route=>{await new Promise(r=>setTimeout(r,80));await route.continue()});
 await page.goto(process.env.QA_URL||'http://127.0.0.1:4188/');
 await scrollToChapter(page,.789);await page.waitForTimeout(1000);
 const result=await page.evaluate(async()=>{
  const world=document.querySelector('#world'),start=scrollY,extra=document.querySelector('.kept-scroll-room').offsetHeight,range=document.querySelector('.scroll-track').offsetHeight-innerHeight,span=.015*(range-extra-document.querySelector('.key-scroll-room').offsetHeight-document.querySelector('.stay-scroll-room').offsetHeight-document.querySelector('.clock-scroll-room').offsetHeight-document.querySelector('.address-scroll-room').offsetHeight)+extra,samples=[];
  await new Promise(resolve=>{let begin;function step(now){begin??=now;const t=Math.min(1,(now-begin)/7000);scrollTo(0,start+span*t);samples.push({p:+world.dataset.progress,frame:+world.dataset.frame,opacity:+getComputedStyle(document.querySelector('#kept-copy')).opacity});if(t<1)requestAnimationFrame(step);else resolve()}requestAnimationFrame(step)});
  return {span,samples};
 });
 const moving=result.samples.filter(s=>s.p>=.789&&s.p<.804);
 assert.ok(result.span>height*2,'Chapter needs more than two screen heights');
 assert.ok(moving.every(s=>s.frame>=0&&s.opacity>.99),'Frames must remain ready beneath visible copy');
 const jumps=moving.slice(1).map((s,i)=>s.frame-moving[i].frame);
 assert.ok(Math.max(...jumps)<=5,`Decoded-frame jump ${Math.max(...jumps)}`);
 assert.ok(Math.min(...jumps)>=-1,'Forward scrolling must not jump backwards');
 await page.waitForTimeout(600);assert.equal(await page.locator('#world').evaluate(e=>+e.dataset.frame),90);
 const at=await page.locator('#world').evaluate(e=>+e.dataset.progress);await page.setViewportSize({width:width===390?844:1000,height:width===390?390:800});await page.waitForTimeout(600);assert.ok(Math.abs(await page.locator('#world').evaluate(e=>+e.dataset.progress)-at)<.0002,'Resize must preserve position');
 console.log(`${width}: seven-second continuous traversal, ${Math.round(result.span)}px, max decoded-frame step ${Math.max(...jumps)}, no blank frames; resize stable`);
 await page.close();
}}finally{await browser.close()}
