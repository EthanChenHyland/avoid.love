import {chromium} from 'playwright';import {scrollToChapter} from './qa-scroll.mjs';import fs from 'node:fs/promises';
const b=await chromium.launch({channel:'chrome'}),report=[];await fs.mkdir('qa/living-background',{recursive:true});
for(const [width,height] of [[390,844],[844,390],[1280,720]]){
 const p=await b.newPage({viewport:{width,height},hasTouch:width<701}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:4188/');
 const go=async at=>{await scrollToChapter(p,at);await p.waitForFunction(at=>Math.abs(+document.querySelector('#world').dataset.progress-at)<.0002,at)};
 await go(1);await p.waitForFunction(()=>document.querySelector('#living-background').currentTime>1);const a=await p.locator('#living-background').evaluate(v=>({time:v.currentTime,videoWidth:v.videoWidth,muted:v.muted,loop:v.loop,duration:v.duration}));await p.waitForTimeout(1400);const time=await p.locator('#living-background').evaluate(v=>v.currentTime);if(time<=a.time)throw Error('Background did not animate while scroll was stationary');if(!a.loop||!a.muted)throw Error('Background must loop silently');
 await p.screenshot({path:`qa/living-background/${width}-ending.png`});
 await p.locator('#living-background').evaluate(v=>{v.currentTime=v.duration-.3});await p.waitForTimeout(1100);const seam=await p.locator('#living-background').evaluate(v=>v.currentTime);if(seam>2)throw Error('Native loop failed to wrap');
 await go(.991);await p.waitForTimeout(600);if(await p.locator('#living-background').evaluate(v=>v.paused))throw Error('Video stopped during exit handoff');
 await go(.985);await p.waitForTimeout(500);if(!await p.locator('#living-background').evaluate(v=>v.paused&&v.currentTime===0))throw Error('Video did not pause/reset outside ending');
 await go(1);await p.getByRole('button',{name:'The story',exact:true}).click();await p.waitForTimeout(300);if(!await p.locator('#living-background').evaluate(v=>v.paused))throw Error('Video plays behind chapter menu');await p.locator('#chapters-close').click();await p.waitForFunction(()=>!document.querySelector('#living-background').paused);
 await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(500);if(!await p.locator('#living-background').evaluate(v=>v.paused))throw Error('Reduced motion video still playing');
 if(errors.length)throw Error(errors.join());report.push({width,height,...a,advanced:time-a.time,seam,errors});await p.close();
}
const p=await b.newPage({viewport:{width:390,height:844}});await p.route('**/films/morning-living-loop*.mp4',r=>r.abort());await p.goto('http://127.0.0.1:4188/');await scrollToChapter(p,1);await p.waitForTimeout(1800);if(await p.locator('#world').getAttribute('data-film')!=='stay')throw Error('Missing background lost morning fallback');await p.close();await b.close();await fs.writeFile('qa/living-background/report.json',JSON.stringify(report,null,2));console.log(report);
