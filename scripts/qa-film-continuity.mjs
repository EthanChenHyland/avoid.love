import {scrollToChapter} from './qa-scroll.mjs';
import {chromium} from 'playwright';import fs from 'node:fs/promises';
const b=await chromium.launch({channel:'chrome'});await fs.mkdir('qa/film-continuity',{recursive:true});const report=[];
for(const [width,height] of [[390,844],[639,734],[701,900],[1280,720]]){
 const p=await b.newPage({viewport:{width,height},hasTouch:width===390}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(process.env.QA_URL||'http://127.0.0.1:4188/');
 const go=async at=>{await scrollToChapter(p,at);await p.waitForFunction(at=>Math.abs(+document.querySelector('#world').dataset.progress-at)<.0002,at)};
 for(const [film,at] of [['opening',.02],['transition',.12],['transition',.18],['pause',.233],['proof',.317],['home',.605],['waiting',.37],['unsent',.487],['distance',.69],['kept',.77],['kept',.802],['impossible',.92],['spare',.957],['spare',.976],['spare',1],['spare',.957],['transition',.18]]){
 await go(at);await p.waitForFunction(film=>{const c=document.querySelector('#world');return c.dataset.film===film&&+c.dataset.frame>=0},film);await p.waitForTimeout(350);const data=await p.locator('#world').evaluate(e=>({...e.dataset}));if((at===1||at===.18)&&+data.frame!==(at===1?90:120))throw Error(`Endpoint not retained ${width} ${at}: ${data.frame}`);report.push({width,at,film,frame:data.frame,cache:data.cached,drawMs:data.drawMs});if([.185,.487,1].includes(at))await p.screenshot({path:`qa/film-continuity/${width}-${at}.png`})
 }
 await go(.487);await p.locator('#letter-object').click();await p.waitForTimeout(700);if(await p.locator('#typed-thought').textContent()!=='I wish you were here.')throw Error('Direct letter interaction failed');await p.locator('#letter-object').click();await p.waitForTimeout(600);if(await p.locator('#letter-object').getAttribute('aria-pressed')!=='false')throw Error('Letter did not release');
 await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(500);await go(1);await p.waitForTimeout(300);if(await p.locator('#world').getAttribute('data-film'))throw Error('Reduced motion still draws film');if(errors.length)throw Error(errors.join());await p.close();
}await b.close();await fs.writeFile('qa/film-continuity/report.json',JSON.stringify(report,null,2));console.log(`${report.length} movie and held-endpoint checks, letter interaction and reduced motion pass`);
