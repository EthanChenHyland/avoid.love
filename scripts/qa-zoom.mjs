import {inspectText} from './layout-probe.mjs';
import {chromium} from 'playwright';import fs from 'node:fs/promises';import path from 'node:path';import {chapters} from '../src/story.mjs';
const ext=path.resolve('scripts/zoom-fixture'),dir=await fs.mkdtemp('/tmp/avoid-zoom-');await fs.mkdir('qa/zoom',{recursive:true});
const b=await chromium.launchPersistentContext(dir,{channel:'chromium',headless:true,viewport:null,args:['--window-size=1440,1000',`--disable-extensions-except=${ext}`,`--load-extension=${ext}`]});
const cdp=await b.newCDPSession(b.pages()[0]);
const sw=b.serviceWorkers()[0]||await b.waitForEvent('serviceworker'),p=b.pages()[0];await p.goto((process.env.QA_URL||'http://127.0.0.1:4175/'));const out=[];
for(const factor of [.8,1,1.25]){
const actual=await sw.evaluate(async factor=>{const [t]=await chrome.tabs.query({url:'http://127.0.0.1:4175/*'});await chrome.tabs.setZoom(t.id,factor);return chrome.tabs.getZoom(t.id)},factor);
await p.waitForTimeout(250);const metrics=await p.evaluate(()=>({innerWidth,innerHeight,dpr:devicePixelRatio}));
for(const c of chapters){await p.evaluate(at=>scrollTo({top:at*(document.querySelector('.scroll-track').offsetHeight-innerHeight),behavior:'instant'}),c.at);await p.waitForFunction(at=>Math.abs(+document.querySelector('#world').dataset.progress-at)<.0002,c.at);await p.waitForTimeout(120);await fs.writeFile(`qa/zoom/${factor}-${c.id}.png`,Buffer.from((await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true})).data,'base64'));out.push({...await p.evaluate(inspectText),factor,actual,chapter:c.id,...metrics,...await p.locator('#world').evaluate(e=>({...e.dataset,overflow:document.documentElement.scrollWidth>innerWidth}))})}
}
await b.close();await fs.rm(dir,{recursive:true,force:true});await fs.writeFile('qa/zoom/report.json',JSON.stringify(out,null,2));console.log(JSON.stringify(out.map(({factor,actual,innerWidth,innerHeight,dpr,chapter,overflow})=>({factor,actual,innerWidth,innerHeight,dpr,chapter,overflow})),null,2));
