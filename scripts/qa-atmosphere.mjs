import {chromium} from 'playwright';
import {scrollToChapter} from './qa-scroll.mjs';
import fs from 'node:fs/promises';
const b=await chromium.launch({channel:'chrome'}),report=[];await fs.mkdir('qa/atmosphere',{recursive:true});
for(const [width,height] of [[390,844],[1280,720]]){
 const p=await b.newPage({viewport:{width,height},hasTouch:width<701}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:4188/');
 for(const [id,at] of [['pause',.233],['proof',.317],['home',.605],['platform',.712],['again',.992]]){
  await scrollToChapter(p,at);await p.waitForFunction(at=>Math.abs(+document.querySelector('#world').dataset.progress-at)<.0002,at);await p.waitForTimeout(900);
  await p.mouse.move(width*.85,height*.7);await p.waitForTimeout(5000);await p.screenshot({path:`qa/atmosphere/${width}-${id}.png`});
  const draws=await p.evaluate(async()=>{const c=document.querySelector('#world').getContext('2d'),fill=c.fillRect;let n=0;c.fillRect=function(...args){n++;return fill.apply(this,args)};await new Promise(r=>setTimeout(r,400));c.fillRect=fill;return n});if(id==='again'&&!draws)throw Error('Living ending did not animate');if(id!=='again'&&draws)throw Error(`Idle redraws in ${id}: ${draws}`);
  report.push({width,id,idleDraws:draws});
 }
 // Check that new physical space does not leak into the accepted envelope interval.
 const geom=await p.evaluate(()=>({range:document.querySelector('.scroll-track').offsetHeight-innerHeight,extra:document.querySelector('.expansion-scroll-room').offsetHeight,vh:innerHeight}));
 if(Math.abs(geom.extra/geom.vh-17)>.01)throw Error('New chapters did not receive seventeen viewports of dedicated space');
 await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(400);await scrollToChapter(p,1);await p.waitForFunction(()=>+document.querySelector('#world').dataset.progress>.999);
 if(errors.length)throw Error(errors.join());await p.close();
}await b.close();await fs.writeFile('qa/atmosphere/report.json',JSON.stringify(report,null,2));console.log(report);
