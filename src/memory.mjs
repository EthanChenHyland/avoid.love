import {progress,smooth,cover} from './timeline.mjs';
/** Photographs and rain live on the scene canvas, with native touch scrolling. */
export function memories({state,wake,signal}){
 const object=document.querySelector('#memory-object');
 const mask=document.createElement('canvas'),mist=document.createElement('canvas');mask.width=mist.width=640;mask.height=mist.height=480;const m=mask.getContext('2d'),f=mist.getContext('2d');let mode='',dragging=false,last=null;
 function frost(){m.globalCompositeOperation='source-over';m.clearRect(0,0,640,480);const x=m.createLinearGradient(0,0,640,0);x.addColorStop(0,'transparent');x.addColorStop(.16,'#fff');x.addColorStop(.84,'#fff');x.addColorStop(1,'transparent');m.fillStyle=x;m.fillRect(0,0,640,480);m.globalCompositeOperation='destination-in';const y=m.createLinearGradient(0,0,0,480);y.addColorStop(0,'transparent');y.addColorStop(.18,'#fff');y.addColorStop(.75,'#fff');y.addColorStop(1,'transparent');m.fillStyle=y;m.fillRect(0,0,640,480);last=null}
 frost();
 function area({w,h,mobile}){return mobile?{x:w*.02,y:h*.08,w:w*.96,h:h*.58}:{x:w*.535,y:h*.035,w:w*.455,h:h*.69}}
 function erase(e){const s=state();if(mode!=='waiting'||e.target.closest('button,a'))return;const r=area(s),x=(e.clientX-r.x)/r.w*640,y=(e.clientY-r.y)/r.h*480;if(x<0||y<0||x>640||y>480){last=null;return}m.globalCompositeOperation='destination-out';m.lineWidth=s.mobile?85:64;m.lineCap='round';m.strokeStyle='#000';m.beginPath();m.moveTo(last?.x??x,last?.y??y);m.lineTo(x+.01,y);m.stroke();last={x,y};wake()}
 const on=(el,event,fn,options={})=>el.addEventListener(event,fn,{...options,signal});
 on(window,'pointerdown',e=>{dragging=true;last=null;erase(e)},{passive:true});on(window,'pointermove',e=>{if(dragging||e.pointerType==='mouse')erase(e)},{passive:true});on(window,'pointerup',()=>{dragging=false;last=null},{passive:true});on(window,'pointercancel',()=>{dragging=false;last=null},{passive:true});
 let album=[],albumReady=false,albumStarted=0,offset=0,grab=null,suppressOpen=false,hand={x:0,y:0};
 function loadAlbum(){if(album.length)return;album=['hero-cafe','us-street','love-morning'].map(name=>{const image=new Image();image.src='/art/'+name+'.webp';return image});Promise.allSettled(album.map(image=>image.decode())).then(()=>{albumReady=true;albumStarted=performance.now();wake()})}
 on(window,'pointerdown',e=>{if(!['little','us'].includes(mode)||!e.target.closest('#memory-object'))return;grab={x:e.clientX,y:e.clientY};suppressOpen=false},{passive:true});
 on(window,'pointermove',e=>{const {w,h}=state();hand={x:e.clientX/w-.5,y:e.clientY/h-.5};if(grab&&Math.abs(e.clientX-grab.x)>25)suppressOpen=true},{passive:true});
 on(window,'pointerup',e=>{if(grab&&Math.abs(e.clientX-grab.x)>45&&Math.abs(e.clientX-grab.x)>Math.abs(e.clientY-grab.y)){offset=(offset+(e.clientX<grab.x?1:2))%3;wake()}grab=null},{passive:true});on(window,'pointercancel',()=>{grab=null;suppressOpen=true});
 function spread(ctx,s){if(!albumReady)return;
 const start=mode==='little'?.252:.563,end=mode==='little'?.307:.642;
 const a=smooth(progress(s.p,start,start+.012))*(1-smooth(progress(s.p,end-.012,end)))* (s.still?1:smooth(Math.min(1,(performance.now()-albumStarted)/300)));
 if(!a)return;const t=progress(s.p,start,end),cw=Math.min(s.w*(s.mobile?.47:.24),s.h<600&&s.w>s.h?s.h*.32:s.mobile&&s.w/s.h>.7?s.h*.27:420),ch=cw*.625,cx=s.w*(s.mobile?.66:.76),cy=s.h*(s.h<600&&s.w>s.h?.65:s.mobile&&s.w/s.h>.7?.74:s.mobile?.66:.59);
 ctx.save();ctx.globalAlpha=a;
 for(let i=0;i<3;i++){const image=album[(i+offset)%3];if(!image?.complete||!image.naturalWidth)continue;ctx.save();const fan=s.still?.5:smooth(t);ctx.translate(cx+(i-1)*cw*(.035+fan*.10),cy+(i-1)*ch*.045);ctx.rotate((i-1)*(.05+fan*.1)+(s.still?0:hand.x*.06));const turn=i===2&&!s.still?smooth(progress(t,.44,.67))*(1-smooth(progress(t,.83,.96))):0;if(i===2)ctx.scale(Math.cos(Math.PI*turn),1);ctx.shadowColor='#120c0880';ctx.shadowBlur=18;ctx.shadowOffsetY=6;ctx.fillStyle='#e9decb';ctx.fillRect(-cw/2-6,-ch/2-6,cw+12,ch+22);ctx.shadowColor='transparent';if(turn>.5){ctx.scale(-1,1);ctx.fillStyle='#614634';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`italic ${Math.max(14,cw*.075)}px Bodoni,serif`;const lines=[['One more coffee.','One more minute.'],['The long way home.','With you.'],['I saved you','a place.']][(i+offset)%3];ctx.fillText(lines[0],0,-ch*.10,cw*.85);ctx.fillText(lines[1],0,ch*.15,cw*.85)}else ctx.drawImage(image,-cw/2,-ch/2,cw,ch);ctx.restore()}
 ctx.restore();
 }
 on(object,'click',()=>{if(suppressOpen){suppressOpen=false;return}offset=(offset+1)%3;wake()});
 on(object,'keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();offset=(offset+(e.key==='ArrowRight'?1:2))%3;wake()}});
 return {get moving(){return albumReady&&['little','us'].includes(mode)&&!state().still&&performance.now()-albumStarted<300},draw(ctx,canvas,source){const s=state(),next=s.p>.252&&s.p<.307?'little':s.p>.34&&s.p<.411?'waiting':s.p>.563&&s.p<.642?'us':'';if(s.p>.16&&s.p<.31||s.p>.54&&s.p<.65)loadAlbum();if(next!==mode){mode=next;offset=mode==='us'?1:0;frost()}
 object.hidden=!['little','us'].includes(mode);object.dataset.photo=String(offset);object.setAttribute('aria-label',`Photograph ${offset+1} of 3. Show the next photograph.`);
 if(['little','us'].includes(mode))spread(ctx,s);if(mode!=='waiting')return;const r=area(s),a=smooth(progress(s.p,.34,.348))*(1-smooth(progress(s.p,.403,.411)));if(a<=0)return;
 f.globalCompositeOperation='source-over';f.clearRect(0,0,640,480);f.filter='blur(5px)';const paint=(image,alpha=1)=>{if(!image)return;if(image.filmImage){paint(image.fallback,alpha);paint(image.filmImage,alpha*image.blend);return}const b=cover(image.width,image.height,s.w,s.h,s.mobile?.77:.5);f.globalAlpha=alpha;f.drawImage(image,(r.x-b.x)/b.w*image.width,(r.y-b.y)/b.h*image.height,r.w/b.w*image.width,r.h/b.h*image.height,0,0,640,480);f.globalAlpha=1};paint(source);f.filter='none';f.fillStyle='#b6c6c330';f.fillRect(0,0,640,480);f.globalCompositeOperation='destination-in';f.drawImage(mask,0,0);
 // A broad clearing passes across the glass with the story; hovering adds real traces.
 const clear=smooth(progress(s.p,.348,.402));f.globalCompositeOperation='destination-out';const opening=f.createRadialGradient(420,245,0,420,245,50+clear*370);opening.addColorStop(0,`rgba(0,0,0,${clear*.88})`);opening.addColorStop(1,'transparent');f.fillStyle=opening;f.fillRect(0,0,640,480);
 ctx.save();ctx.globalAlpha=a*.72;ctx.drawImage(mist,r.x,r.y,r.w,r.h);ctx.restore();
 },close(){}};
}
