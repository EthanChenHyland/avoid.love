import {clamp,smooth,mix} from './timeline.mjs';
export const finaleDuration=18000;
export function finalePhase(elapsed){
 const t=((elapsed%finaleDuration)+finaleDuration)%finaleDuration;
 return t<7000?t/7000:t<10000?1:t<17000?1-(t-10000)/7000:0;
}
export function finalePoint(i,count,t,w,h,wind=0){
 const a=i*2.399963,r=Math.sqrt((i+.5)/count),g=smooth(t),turn=a+(1-g)*Math.PI*5;
 const bloom=Math.min(w*.27,h*.23),petal=1+.22*Math.cos(a*5);
 const tx=w*.73+Math.cos(a)*r*bloom*petal,ty=h*.66+Math.sin(a)*r*bloom*.86*petal;
 const depth=Math.sin(turn)*(1-g),perspective=1/(1+depth*.24);
 return {x:mix(w*.5+Math.cos(turn)*(w*.64+r*w*.22)*perspective,tx,g)+wind*(1-r)*22,y:mix(h*.5+Math.sin(turn)*(h*.66+r*h*.2)*perspective,ty,g),r:mix(4+r*7,2+r*5,g),angle:turn,depth};
}
/** A continuous gather / rest / release cycle; suspends when the ending leaves view. */
export function finale({state,clock=()=>performance.now()}){
 let elapsed=0,last=0,active=false;
 return {get moving(){return active},draw(c){
  const {p,w,h,mobile,still,visitor:v}=state(),now=clock();
  if(p<.985){elapsed=0;last=0;active=false;return}
  if(still){active=false;last=0;return}
  if(p<.9995){active=false;last=0;return}
  active=true;elapsed=(elapsed+(last?Math.min(40,now-last):0))%finaleDuration;last=now;
  const t=finalePhase(elapsed),count=mobile?200:360,wind=v.x*v.presence;
  c.save();
  const points=Array.from({length:count},(_,i)=>({i,...finalePoint(i,count,t,w,h,wind)})).sort((a,b)=>a.depth-b.depth);
  for(const q of points){const dx=q.x-w*(v.x+1)/2,dy=q.y-h*(v.y+1)/2,near=Math.max(0,1-Math.hypot(dx,dy)/Math.min(w*.3,180))*v.presence;
   c.save();c.translate(q.x+dx*near*.16,q.y+dy*near*.16);c.rotate(q.angle+near*.8);c.globalAlpha=(.4+(q.i%7)*.07)*smooth(clamp(t*9));c.fillStyle=['#8c1c2b','#b92e3c','#d44b49','#a53137','#e36c58'][q.i%5];c.beginPath();c.ellipse(0,0,q.r,q.r*(.35+.4*Math.abs(Math.sin(q.angle))),0,0,Math.PI*2);c.fill();c.restore();
  }
  c.globalAlpha=smooth(clamp((t-.7)/.3))*.9;c.fillStyle='#382526';c.beginPath();c.ellipse(w*.73,h*.66,Math.min(w*.036,h*.04),Math.min(w*.03,h*.035),0,0,Math.PI*2);c.fill();c.restore();
 }};
}
