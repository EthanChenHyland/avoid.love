import {chromium} from 'playwright';import fs from 'node:fs/promises';
const b=await chromium.launch({channel:'chrome'}),out=[];await fs.mkdir('qa/materials',{recursive:true});
for(const [width,height] of [[320,568],[390,844],[639,734],[1280,720]]){
 const p=await b.newPage({viewport:{width,height},hasTouch:width<700}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(process.env.QA_URL||'http://127.0.0.1:4188/');await p.evaluate(()=>document.fonts.ready);
 for(const at of [.298,.405,.736,1]){await p.evaluate(at=>scrollTo(0,at*(document.querySelector('.scroll-track').offsetHeight-innerHeight)),at);await p.waitForTimeout(650);await p.mouse.move(width*.85,height*.68);await p.waitForTimeout(450);await p.screenshot({path:`qa/materials/${width}-${at}.png`});if(at===1){const size=await p.locator('#love-copy h2 > .kinetic-word').evaluate(e=>parseFloat(getComputedStyle(e).fontSize));if(size<150)throw Error(`Final love lost display scale: ${width}, ${size}`)}}
 await p.getByRole('button',{name:'The story',exact:true}).click();await p.locator('.chapter-links a[href="#space"]').click();await p.waitForTimeout(1200);if(await p.locator('#world').getAttribute('data-beat')!=='space')throw Error('New chapter route failed');if(errors.length)throw Error(errors.join());out.push({width,errors});await p.close();
}await b.close();console.log(out);
