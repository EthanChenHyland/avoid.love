import {scrollToChapter} from './qa-scroll.mjs';
import {chromium} from 'playwright';
const b=await chromium.launch({channel:'chrome'}),out=[];
for(const mode of ['offline-films','reduced','no-js']){
 const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:mode==='reduced'?'reduce':'no-preference',javaScriptEnabled:mode!=='no-js'}),errors=[];p.on('pageerror',e=>errors.push(e.message));if(mode==='offline-films')await p.route('**/frames/**',r=>r.abort());await p.goto(process.env.QA_URL||'http://127.0.0.1:4188/');
 if(mode==='no-js'){if(await p.locator('.scroll-track article').count()!==28)throw Error('No-JS chapters missing');out.push({mode,chapters:28});await p.close();continue}
 for(const at of [.457,.905,.957,.233,.317,.605,.712,.992,.185,.218,.27,.298,.37,.405,.487,.526,.538,.58,.628,.69,.736,.77,.802,.855,.934,.976,1]){await scrollToChapter(p,at);await p.waitForTimeout(500);const d=await p.locator('#world').evaluate(c=>({...c.dataset}));if(mode==='reduced'&&d.film)throw Error('Reduced motion film');if(mode==='offline-films'&&+d.frame!==-1)throw Error('Offline film expected fallback');}
 if(errors.length)throw Error(errors.join());out.push({mode,errors});await p.close();
}await b.close();console.log(out);
