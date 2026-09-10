import {scrollToChapter} from './qa-scroll.mjs';
import {chromium} from 'playwright';
const b=await chromium.launch({channel:'chrome'});const report=[];
for(const [blocked,at,frame] of [['**/frames/petal-transition/**',.105,'/frames/poppy-film/desktop/000.webp'],['**/art/little-things-mobile.webp',.29,'/frames/petal-transition/desktop/120.webp']]){
 const p=await b.newPage({viewport:{width:390,height:844}});let release;const ready=new Promise(r=>release=r);await p.route(blocked,async route=>{await ready;try{await route.continue()}catch{}});await p.goto(process.env.QA_URL||'http://127.0.0.1:4188/');
 await scrollToChapter(p,at);await p.waitForTimeout(1400);
 const difference=await p.evaluate(async path=>{const canvas=document.querySelector('#world'),image=new Image();image.src=path;await image.decode();const expected=document.createElement('canvas');expected.width=canvas.width;expected.height=canvas.height;const c=expected.getContext('2d'),w=innerWidth,h=innerHeight,scale=Math.max(w/image.width,h/image.height);c.setTransform(canvas.width/w,0,0,canvas.height/h,0,0);c.drawImage(image,(w-image.width*scale)*.77,(h-image.height*scale)*.5,image.width*scale,image.height*scale);const rows=Math.floor(canvas.height*.22),a=canvas.getContext('2d').getImageData(0,0,canvas.width,rows).data,d=c.getImageData(0,0,canvas.width,rows).data;let sum=0;for(let i=0;i<a.length;i++)if(i%4!==3)sum+=Math.abs(a[i]-d[i]);return sum/(a.length*.75*255)},frame);
 if(difference>.002)throw Error(`Outgoing frame replaced before incoming load ${at}: ${difference}`);release();await p.waitForTimeout(1000);report.push({at,outgoingPixelDifference:difference});await p.close();
}await b.close();console.log(report);
