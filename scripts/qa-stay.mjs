import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {scrollToChapter} from './qa-scroll.mjs';
const browser=await chromium.launch({channel:'chrome'});
const pixels=page=>page.locator('#world').evaluate(c=>{const s=document.createElement('canvas');s.width=160;s.height=100;const x=s.getContext('2d');x.drawImage(c,0,0,160,100);return [...x.getImageData(0,0,160,100).data]});
const diff=(a,b)=>a.reduce((v,n,i)=>v+(i%4===3?0:Math.abs(n-b[i])),0)/(a.length*.75*255);
try{for(const [width,height] of [[390,844],[639,734],[1280,720]]){
 const page=await browser.newPage({viewport:{width,height}});await page.goto(process.env.QA_URL||'http://127.0.0.1:4188/');
 const go=async at=>{await scrollToChapter(page,at);await page.waitForTimeout(750)};
 const ratio=await page.evaluate(()=>{const track=document.querySelector('.scroll-track'),extra=document.querySelector('.kept-scroll-room').offsetHeight,key=document.querySelector('.key-scroll-room').offsetHeight,stay=document.querySelector('.stay-scroll-room').offsetHeight,base=track.offsetHeight-innerHeight-extra-key-stay-document.querySelector('.clock-scroll-room').offsetHeight-document.querySelector('.address-scroll-room').offsetHeight,oldKey=extra/210*15;return (base*.018+key)/(base*.018+oldKey)});
 assert.ok(Math.abs(ratio-1.5)<.004,`Key interval ratio ${ratio}`);
 await go(.9658);const outgoing=await pixels(page);await go(.9662);const delta=diff(outgoing,await pixels(page));assert.ok(delta<.03,`Morning handoff difference ${delta}`);
 await go(.976);await page.waitForFunction(()=>document.querySelector('#world').dataset.film==='stay'&&+document.querySelector('#world').dataset.frame>0);
 assert.equal(await page.locator('.chapter-links a').count(),20);
 assert.equal(await page.locator('#world').getAttribute('data-beat'),'stay');
 await page.screenshot({path:`qa/${width}-stay-live.png`});
 for(const at of [.986,1,.987]){await go(at);await page.waitForFunction(()=>+document.querySelector('#world').dataset.frame===90);}
 await go(.96);assert.equal(await page.locator('#world').getAttribute('data-film'),'impossible');
 await page.getByRole('button',{name:'The story',exact:true}).click();await page.locator('.chapter-links a[href="#stay"]').click();await page.waitForFunction(()=>document.querySelector('#world').dataset.beat==='stay');
 console.log(`${width}: key ratio ${ratio.toFixed(4)}, matched handoff ${(delta*100).toFixed(2)}%, chapter navigation, film and endpoint hold pass`);await page.close();
}
const page=await browser.newPage({viewport:{width:390,height:844}});await page.route('**/frames/stay-longer-film/**',r=>r.abort());await page.goto(process.env.QA_URL||'http://127.0.0.1:4188/');await scrollToChapter(page,.96);await page.waitForTimeout(1100);const held=await pixels(page);await scrollToChapter(page,.976);await page.waitForTimeout(1100);assert.ok(diff(held,await pixels(page))<.08,'Missing new film must retain the existing morning scene');console.log('Unavailable new footage retains the previous scene');await page.close();
}finally{await browser.close()}
