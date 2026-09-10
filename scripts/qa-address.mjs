import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {scrollToChapter} from './qa-scroll.mjs';
const browser=await chromium.launch({channel:'chrome'});
try{for(const [width,height] of [[390,844],[844,390],[1280,720]]){
 const p=await browser.newPage({viewport:{width,height},hasTouch:true}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(process.env.QA_URL||'http://127.0.0.1:4188/');
 await p.getByRole('button',{name:'The story',exact:true}).click();await p.locator('.chapter-links a[href="#address"]').click();await p.waitForFunction(()=>document.querySelector('#world').dataset.beat==='address');await p.waitForTimeout(800);
 assert.equal(await p.locator('.chapter-links a').count(),20);
 assert.ok(await p.locator('#address-copy').evaluate(e=>+getComputedStyle(e).opacity)>.99);
 await p.mouse.move(width*.75,height*.73);await p.waitForTimeout(400);await p.screenshot({path:`qa/${width}-address-live.png`});
 const y=await p.evaluate(()=>scrollY),cdp=await p.context().newCDPSession(p);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:width*.7,y:height*.75}]});
 for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:width*.7,y:height*.75-i*12}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(600);assert.ok(await p.evaluate(()=>scrollY)>y,'Postcard must not block native scrolling');
 for(const at of [.804,.812,.820]){await scrollToChapter(p,at);await p.waitForTimeout(600);await p.waitForFunction(()=>+document.querySelector('#world').dataset.frame===90)}
 await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(300);await scrollToChapter(p,.538);await p.waitForTimeout(600);assert.equal(await p.locator('#world').getAttribute('data-film'),'');assert.deepEqual(errors,[]);
 console.log(`${width}: address navigation, copy, native touch, reduced motion and held-envelope key turn pass`);await p.close();
}}finally{await browser.close()}
