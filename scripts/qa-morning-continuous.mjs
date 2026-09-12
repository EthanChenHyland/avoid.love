import {chromium} from 'playwright';import {scrollToChapter} from './qa-scroll.mjs';import {storyToScroll} from '../src/scroll-map.mjs';import fs from 'node:fs/promises';
const b=await chromium.launch({channel:'chrome'}),report=[];await fs.mkdir('qa/morning-continuous',{recursive:true});
for(const [width,height] of [[390,844],[639,734],[844,390],[1280,720]]){
 const p=await b.newPage({viewport:{width,height}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.route('**/frames/morning-steady-film/**',async r=>{await new Promise(r=>setTimeout(r,70));await r.continue().catch(()=>{})});await p.goto('http://127.0.0.1:4188/');
 const go=async at=>{await scrollToChapter(p,at);await p.waitForFunction(at=>Math.abs(+document.querySelector('#world').dataset.progress-at)<.0001,at);await p.waitForTimeout(650)};
 const pixels=()=>p.locator('#world').evaluate(c=>{const s=document.createElement('canvas');s.width=160;s.height=100;const x=s.getContext('2d');x.drawImage(c,0,0,160,100);return [...x.getImageData(0,0,160,100).data]});
 await go(.96599);const a=await pixels();await go(.96601);const z=await pixels();const delta=a.reduce((s,v,i)=>s+(i%4===3?0:Math.abs(v-z[i])),0)/(a.length*.75*255);if(delta>.005)throw Error(`Exposure jump ${width}: ${delta}`);
 await p.screenshot({path:`qa/morning-continuous/${width}-join.png`});await go(.952);
 const geometry=await p.evaluate(()=>[document.querySelector('.scroll-track').offsetHeight-innerHeight,...['kept','key','stay','clock','address','expansion'].map(n=>document.querySelector(`.${n}-scroll-room`).offsetHeight)]);
 const start=storyToScroll(.952,...geometry),end=storyToScroll(.986,...geometry);const frames=[];
 for(let i=0;i<=100;i++){await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),start+(end-start)*i/100);await p.waitForTimeout(70);const d=await p.locator('#world').evaluate(c=>({...c.dataset}));if(d.film!=='spare'||+d.frame<0)throw Error('Shot switched or blanked');frames.push(+d.frame)}
 let maxStep=0;for(let i=1;i<frames.length;i++){if(frames[i]<frames[i-1])throw Error('Frame timeline reset');maxStep=Math.max(maxStep,frames[i]-frames[i-1])}if(maxStep>6)throw Error(`Abrupt source step ${maxStep}`);
 await go(.987);if(+await p.locator('#world').getAttribute('data-frame')!==90)throw Error('Endpoint not held');await go(.9658);if(await p.locator('#world').getAttribute('data-film')!=='spare')throw Error('Reverse switched film');if(errors.length)throw Error(errors.join());report.push({width,height,boundaryMeanDifference:delta,maxStep,errors});await p.close();
}await b.close();await fs.writeFile('qa/morning-continuous/report.json',JSON.stringify(report,null,2));console.log(report);
