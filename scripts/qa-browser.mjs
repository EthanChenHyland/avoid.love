import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import {chapters} from '../src/story.mjs';
const browser=await chromium.launch({channel:'chrome',headless:true});
const report=[];
for (const [label,width,height] of [['desktop',1280,720],['mobile',390,844]]) {
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:label==='mobile',hasTouch:label==='mobile'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 await page.goto('http://127.0.0.1:4174/');await page.waitForTimeout(800);
 for (const c of chapters){
  if(c.at){await page.getByRole('button',{name:'The story',exact:true}).click();await page.locator(`#chapters a[href="#${c.id}"]`).click()}
  await page.waitForFunction(at=>Math.abs(Number(document.querySelector('#world').dataset.progress)-at)<.0001,c.at);await page.waitForTimeout(400);
  await page.screenshot({path:`qa/${label}-${c.id}.png`});
  report.push({viewport:label,chapter:c.id,...await page.locator('#world').evaluate(e=>({...e.dataset,overflow:document.documentElement.scrollWidth>innerWidth}))});
 }
 await page.getByRole('button',{name:'Replay the story'}).click();await page.waitForFunction(()=>Number(document.querySelector('#world').dataset.progress)<.001);
 await page.getByRole('button',{name:'The story',exact:true}).click();await page.keyboard.press('Escape');if(await page.locator('#chapters').isVisible())throw Error('Escape failed');
 await page.getByRole('button',{name:'The story',exact:true}).click();await page.getByRole('button',{name:'Still-frame mode'}).click();await page.locator('#chapters a[href="#unsent"]').click();await page.waitForTimeout(500);
 if(await page.locator('#typed-thought').textContent()!=='I wish you were here.')throw Error('Still mode letter missing');
 report.push({viewport:label,check:'still',...await page.locator('#world').evaluate(e=>e.dataset)});
 await page.locator('#hold-memory').focus();await page.keyboard.down('Space');if(await page.locator('#hold-memory').getAttribute('aria-pressed')!=='true')throw Error('Hold failed');await page.keyboard.up('Space');
 await page.goto('http://127.0.0.1:4174/#reading');await page.waitForTimeout(200);if(!await page.locator('#reading').isVisible())throw Error('Reading mode missing');
 report.push({viewport:label,errors});await page.close();
}
await fs.writeFile('qa/browser-report.json',JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report,null,2));
