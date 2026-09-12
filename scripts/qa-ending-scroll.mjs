import {chromium} from 'playwright';import {scrollToChapter} from './qa-scroll.mjs';import fs from 'node:fs/promises';
const b=await chromium.launch({channel:'chrome'}),report=[];
try{for(const [width,height] of [[320,568],[390,844],[844,390],[1280,720]]){
 const p=await b.newPage({viewport:{width,height}});await p.goto('http://127.0.0.1:4188/');const snapshots=[];
 for(const at of [.996,.997,.998,.999,.9999,1,.999,.998,.997,.996]){
  await scrollToChapter(p,at);await p.waitForFunction(at=>Math.abs(+document.querySelector('#world').dataset.progress-at)<.00001,at);await p.waitForTimeout(100);
  const d=await p.evaluate(()=>({y:scrollY,avoid:+document.querySelector('#avoid-word').style.opacity,label:document.querySelector('#next-beat').getAttribute('aria-label'),word:+document.querySelector('#avoid-word .kinetic-word').style.opacity}));
  if((at>.99985)!==(d.label==='Replay the story'))throw Error(`Early replay ${at}`);if(at===.998&&d.word<.99)throw Error('Avoid word not fully readable');snapshots.push({at,...d});
 }
 for(const at of [.996,.997,.998,.999]){const pair=snapshots.filter(s=>s.at===at);if(Math.abs(pair[0].avoid-pair[1].avoid)>.025)throw Error('Reverse text discontinuity')}
 if(snapshots[5].y-snapshots[1].y<height*1.7)throw Error('Ending scroll too short');
 await scrollToChapter(p,.998);await p.waitForTimeout(700);await p.screenshot({path:`qa/ending-scroll-${width}.png`});
 report.push({width,height,snapshots});await p.close();
}await fs.writeFile('qa/ending-scroll.json',JSON.stringify(report,null,2));console.log('Ending forward/reverse and replay timing passed at four sizes');}finally{await b.close()}
