import {scrollToChapter} from './qa-scroll.mjs';
import {chromium} from 'playwright';
const b=await chromium.launch({channel:'chrome'}),p=await b.newPage({viewport:{width:699,height:844}});await p.goto(process.env.QA_URL||'http://127.0.0.1:4188/');
for(const at of [.185,1]){
 await scrollToChapter(p,at);await p.waitForFunction(at=>{const c=document.querySelector('#world');return Math.abs(+c.dataset.progress-at)<.0002&&+c.dataset.frame===120},at);await p.waitForTimeout(250);
 await p.route('**/frames/**',route=>route.abort());
 for(const width of [701,700,639,390,699]){await p.setViewportSize({width,height:844});await p.waitForTimeout(100);const frame=await p.locator('#world').getAttribute('data-frame');if(frame!=='120')throw Error(`Resize discarded endpoint ${at} ${width}: ${frame}`)}
 await p.unroute('**/frames/**');
}await b.close();console.log('Both film endpoints survive repeated 700px crossings with frame requests blocked');
