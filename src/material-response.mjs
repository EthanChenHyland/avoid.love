import {clamp} from './timeline.mjs';
/** Bounded tactile motion; passive input leaves native touch scrolling intact. */
export function materialResponse({state,wake,signal}){
 let last=null,clock=0,angle=0,velocity=0,waves=[];
 function input(e){
  const {p,w,h,still}=state();
  if(still||e.target.closest('button,a,.reading')||!document.querySelector('#chapters').hidden)return;
  const now=performance.now(),speed=last?clamp((e.clientX-last.x)/Math.max(16,now-last.time),-2,2):.35;
  last={x:e.clientX,time:now};
  if(p>.714&&p<.754&&e.clientY>h*.52&&e.clientY<h*.9&&(!waves.length||now-waves.at(-1).time>70)){
   waves.push({y:e.clientY/h,time:now,power:clamp(Math.abs(speed)+.25,.25,1)});waves=waves.slice(-5);wake();
  }
  if(p>.788&&p<.824&&Math.hypot((e.clientX/w-.8)*w,(e.clientY/h-.72)*h)<Math.min(w*.22,160)){
   velocity=clamp(velocity+speed*.4,-2.5,2.5);wake();
  }
 }
 for(const event of ['pointermove','pointerdown'])window.addEventListener(event,input,{passive:true,signal});
 window.addEventListener('pointerleave',()=>{last=null},{signal});
 return {
  get key(){return angle},get moving(){return waves.length>0||Math.abs(angle)>.0005||Math.abs(velocity)>.0005},
  update(){const {p,still}=state(),now=performance.now(),dt=Math.min(.035,clock?(now-clock)/1000:.016);clock=now;
   if(still){waves=[];angle=velocity=0;return}
   waves=waves.filter(a=>now-a.time<1400&&p>.714&&p<.754);
   if(p<=.788||p>=.824){angle=velocity=0;return}
   velocity+=(-angle*45-velocity*11)*dt;angle=clamp(angle+velocity*dt,-.35,.35);
   if(Math.abs(angle)<.0005&&Math.abs(velocity)<.0005)angle=velocity=0;
  },
  thread(y,u){const now=performance.now();return waves.reduce((sum,a)=>{const age=(now-a.time)/1000;return sum+Math.sin(u*15-age*13)*Math.sin(Math.PI*u)*Math.exp(-age*3.8)*Math.exp(-Math.abs(y-a.y)*22)*a.power},0)}
 };
}
