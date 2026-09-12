import {chromium} from 'playwright';import {scrollToChapter} from './qa-scroll.mjs';import fs from 'node:fs/promises';
const b=await chromium.launch({channel:'chrome'}),report=[];await fs.mkdir('qa/three-chapters',{recursive:true});
for(const [width,height] of [[390,844],[844,390],[1280,720]]){
 const page=await b.newPage({viewport:{width,height},hasTouch:width<701}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4188/');
 for(const [id,at] of [['margins',.457],['familiar',.905],['spare',.957]]){
  await page.getByRole('button',{name:'The story',exact:true}).click();await page.locator(`.chapter-links a[href="#${id}"]`).click();await page.waitForFunction(id=>document.querySelector('#world').dataset.beat===id,id);await page.waitForTimeout(1100);
  if(+await page.locator(`#${id}-copy`).evaluate(e=>getComputedStyle(e).opacity)<.99)throw Error(`${id} caption not fully visible`);
  await page.mouse.move(width*.8,height*.7);await page.waitForTimeout(1400);await page.screenshot({path:`qa/three-chapters/${width}-${id}.png`});
  if(id==='margins'&&await page.locator('#letter-object').isVisible())throw Error('Old letter target overlaps the new chapter');
  report.push({width,height,id});
 }
 await page.route('**/frames/morning-steady-film/**',async r=>{await new Promise(r=>setTimeout(r,160));await r.continue().catch(()=>{})});
 for(const at of [.94,.95,.957,.965,.969,.957,.95,.94]){await scrollToChapter(page,at);await page.waitForFunction(at=>Math.abs(+document.querySelector('#world').dataset.progress-at)<.0002,at);await page.waitForTimeout(600);const d=await page.locator('#world').evaluate(c=>({...c.dataset}));if(+d.cached>48)throw Error('Film cache exceeded budget');if(at===.957&&d.film!=='spare')throw Error('New footage not integrated');}
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(400);for(const at of [.457,.905,.957,1]){await scrollToChapter(page,at);await page.waitForFunction(at=>Math.abs(+document.querySelector('#world').dataset.progress-at)<.0002,at)}
 if(errors.length)throw Error(errors.join());await page.close();
}await b.close();await fs.writeFile('qa/three-chapters/report.json',JSON.stringify(report,null,2));console.log(report);
