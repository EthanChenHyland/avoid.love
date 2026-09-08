import {chromium} from 'playwright';import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'});const report=[];
for(const mode of ['reduced','offline-films','no-js','landscape']){
 const page=await browser.newPage({viewport:mode==='landscape'?{width:844,height:390}:{width:390,height:844},reducedMotion:mode==='reduced'?'reduce':'no-preference',javaScriptEnabled:mode!=='no-js'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 if(mode==='offline-films')await page.route('**/frames/**',r=>r.abort());
 await page.goto(process.env.QA_URL||'http://127.0.0.1:4188/');await page.waitForTimeout(300);
 if(mode==='no-js'){const h=await page.locator('article h2').allTextContents();if(h.length!==12)throw Error('Missing no-JS story');report.push({mode,headings:h.length});await page.close();continue}
 if(mode==='landscape'){await page.screenshot({path:'qa/landscape-opening.png'});await page.getByRole('button',{name:'The story',exact:true}).click();await page.screenshot({path:'qa/landscape-menu.png'});await page.keyboard.press('Escape')}
 await page.evaluate(()=>window.scrollTo({top:(document.querySelector('.scroll-track').offsetHeight-innerHeight)*.485,behavior:'instant'}));await page.waitForTimeout(800);
 const state=await page.locator('#world').evaluate(e=>({...e.dataset,still:document.documentElement.dataset.still,overflow:document.documentElement.scrollWidth>innerWidth}));
 if(mode==='reduced'&&(state.still!=='true'||state.cached!=='0'))throw Error('Reduced motion used frames');
 if(mode==='offline-films'&&state.frame!=='-1')throw Error('Expected poster fallback');
 await page.screenshot({path:`qa/${mode}-unsent.png`});
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(600);if(await page.locator('#world').getAttribute('data-chapter')!=='before')throw Error('Reverse failed');
 report.push({mode,state,errors});await page.close();
}
await browser.close();await fs.writeFile('qa/resilience-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
