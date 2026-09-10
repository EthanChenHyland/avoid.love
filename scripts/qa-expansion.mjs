import {scrollToChapter} from './qa-scroll.mjs';
import {chromium} from 'playwright';import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'}),report=[];await fs.mkdir('qa/expansion-features',{recursive:true});
for(const [width,height] of [[320,568],[390,844],[639,734],[1280,720]]){
 const page=await browser.newPage({viewport:{width,height},hasTouch:width<700}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.QA_URL||'http://127.0.0.1:4188/');await page.evaluate(()=>document.fonts.ready);
 for(const [id,at] of [['hours',.218],['detour',.628],['impossible',.855],['light',.934],['pressed',.298],['blue',.405],['space',.736],['unsaid',.522],['address',.538],['kept',.802],['stay',.976],['love',1]]){await scrollToChapter(page,at);await page.waitForTimeout(650);await page.screenshot({path:`qa/expansion-features/${width}-${id}.png`});}
 await page.getByRole('button',{name:'The story',exact:true}).click();if(await page.locator('.chapter-links a').count()!==20)throw Error('Missing expanded chapter navigation');await page.locator('.chapter-links a[href="#hours"]').click();await page.waitForTimeout(1200);if(await page.locator('#world').getAttribute('data-beat')!=='hours')throw Error('New chapter navigation failed');
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(500);if(await page.locator('#world').getAttribute('data-film'))throw Error('Reduced motion used a film');if(errors.length)throw Error(errors.join());report.push({width,height,errors,chapters:20});await page.close();
}await browser.close();await fs.writeFile('qa/expansion-features/report.json',JSON.stringify(report,null,2));console.log(report);
