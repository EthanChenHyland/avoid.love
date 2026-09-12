import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'}),report=[];
try{
 for(const mobile of [false,true]){
  const page=await browser.newPage();await page.goto('http://127.0.0.1:4188/');
  const result=await page.evaluate(async mobile=>{
   const image=new Image();image.src=`/frames/morning-steady-film/${mobile?'mobile':'desktop'}/090.webp`;await image.decode();
   const video=document.createElement('video');video.muted=true;video.playsInline=true;video.src=`/films/morning-steady-loop${mobile?'-mobile':''}.mp4`;document.body.append(video);
   await new Promise((resolve,reject)=>{video.onerror=reject;video.requestVideoFrameCallback(()=>{video.pause();resolve()});video.play().catch(reject)});
   const canvas=document.createElement('canvas');canvas.width=160;canvas.height=90;const ctx=canvas.getContext('2d',{willReadFrequently:true});
   const stage=document.createElement('canvas');stage.width=1280;stage.height=720;const sc=stage.getContext('2d');sc.drawImage(image,0,0,1280,720);ctx.drawImage(stage,0,0,160,90);const a=ctx.getImageData(0,0,160,90).data;sc.drawImage(video,0,0,1280,720);ctx.drawImage(stage,0,0,160,90);const b=ctx.getImageData(0,0,160,90).data;
   let delta=0;const offset=[0,0,0];for(let i=0;i<a.length;i+=4)for(let c=0;c<3;c++){delta+=Math.abs(b[i+c]-a[i+c]);offset[c]+=b[i+c]-a[i+c]}
   video.remove();return {mobile,meanDifference:delta/(160*90*3*255),channelOffset:offset.map(v=>v/(160*90))};
  },mobile);
  if(result.meanDifference>.008||result.channelOffset.some(v=>Math.abs(v)>.5))throw Error(JSON.stringify(result));report.push(result);await page.close();
 }
 await fs.writeFile('qa/ending-color.json',JSON.stringify(report,null,2));console.log(report);
}finally{await browser.close()}
