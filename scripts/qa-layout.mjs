import {inspectText} from './layout-probe.mjs';
import {chromium} from 'playwright';import fs from 'node:fs/promises';
const b=await chromium.launch({channel:'chrome'}),results=[];const tag=process.argv[2]||'before';await fs.mkdir(`qa/${tag}`,{recursive:true});
const points=process.env.QA_POINTS?JSON.parse(process.env.QA_POINTS):[0,.012,.035,.06,.072,.12,.16,.185,.22,.245,.27,.315,.355,.425,.449,.487,.527,.54,.555,.58,.655,.69,.752,.77,.825,.855,.89,.92,.945,.965,1];
for(const [w,h] of (process.env.QA_SIZES?JSON.parse(process.env.QA_SIZES):[[1920,1080],[1440,900],[1280,720],[1024,768],[768,1024],[700,900],[390,844],[844,390]])){
const p=await b.newPage({viewport:{width:w,height:h}});await p.goto((process.env.QA_URL||'http://127.0.0.1:4175/'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);
for(const at of points){await p.evaluate(at=>scrollTo({top:at*(document.querySelector('.scroll-track').offsetHeight-innerHeight),behavior:'instant'}),at);await p.waitForFunction(at=>Math.abs(+document.querySelector('#world').dataset.progress-at)<.0002,at);await p.waitForTimeout(80);
const findings=await p.evaluate(inspectText);
if(findings.collisions.length||findings.clipped.length||findings.overflow)results.push({w,h,at,...findings});
if([0,.185,.27,.355,.487,.58,.69,.77,.855,1].includes(at)&&[390,1280,1920,844].includes(w))await p.screenshot({path:`qa/${tag}/${w}-${at}.png`});
}await p.close();}
await b.close();await fs.writeFile(`qa/${tag}/layout.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
