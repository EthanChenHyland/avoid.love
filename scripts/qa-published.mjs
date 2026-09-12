import {chromium} from 'playwright';import {scrollToChapter} from './qa-scroll.mjs';
const base=process.env.QA_URL||'https://avoid.love';
const b=await chromium.launch({channel:'chrome'});
try{for(const [width,height] of [[390,844],[1280,720]]){
 const p=await b.newPage({viewport:{width,height}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 const response=await p.goto(base+'/');if(response.status()!==200)throw Error('Homepage failed');
 await p.waitForFunction(()=>document.querySelector('#world')?.dataset.progress!==undefined);
 const manifest=await p.request.get(base+'/film-manifest.json');if(!manifest.ok())throw Error('Manifest failed');
 await scrollToChapter(p,1);await p.waitForFunction(()=>document.querySelector('#world').dataset.backgroundReady==='true'&&document.querySelector('#living-background').currentTime>1,{},{timeout:60000});
 const a=await p.locator('#living-background').evaluate(v=>v.currentTime);await p.waitForTimeout(1000);const z=await p.locator('#living-background').evaluate(v=>v.currentTime);if(z<=a)throw Error('Live background not advancing');
 await p.screenshot({path:`qa/published-${width}.png`});if(errors.length)throw Error(errors.join());console.log({width,height,status:response.status(),backgroundAdvanced:z-a,errors});await p.close();
}}finally{await b.close()}
