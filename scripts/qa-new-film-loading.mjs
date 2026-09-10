import {chromium} from 'playwright';
import {scrollToChapter} from './qa-scroll.mjs';
import fs from 'node:fs/promises';
const b=await chromium.launch({channel:'chrome'}),report=[];
for(const [width,height] of [[390,844],[1280,720]]){
 const p=await b.newPage({viewport:{width,height}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/frames/**',async r=>{if(/pause-film|small-proof-film|almost-home-film/.test(r.request().url()))await new Promise(r=>setTimeout(r,180));await r.continue().catch(()=>{})});
 await p.goto(process.env.QA_URL||'http://127.0.0.1:4188/');
 for(const [film,at] of [['pause',.233],['proof',.317],['home',.605],['proof',.317],['pause',.233]]){
  await scrollToChapter(p,at);await p.waitForFunction(at=>Math.abs(+document.querySelector('#world').dataset.progress-at)<.0002,at);
  await p.waitForFunction(film=>document.querySelector('#world').dataset.film===film&&+document.querySelector('#world').dataset.frame>=0,film);
  await p.waitForTimeout(650);const data=await p.locator('#world').evaluate(c=>({...c.dataset}));if(+data.cached>48)throw Error('Cache grew beyond two film budget');
  const frame=data.frame;await p.waitForTimeout(500);if(await p.locator('#world').getAttribute('data-frame')!==frame)throw Error('Scroll controlled film moved while stationary');report.push({width,film,frame,cached:data.cached});
 }
 if(errors.length)throw Error(errors.join());await p.close();
}await b.close();await fs.writeFile('qa/new-film-loading.json',JSON.stringify(report,null,2));console.log(report);
