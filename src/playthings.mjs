import {drawStorySpectacle} from './story-spectacle.mjs';
import {drawKeepsakes} from './keepsake-effects.mjs';
import {ripples} from './ripples.mjs';
import {atmosphere} from './atmosphere.mjs';
import {progress,smooth} from './timeline.mjs';
/** Petals belong to the flower: scene-entry motion, then scroll-driven drift. */
export function playthings({state,wake,signal}){
 let scene='',entered=0,running=false;const air=atmosphere(),water=ripples({state,wake,signal});
 const petals=Array.from({length:28},(_,i)=>({seed:((i*47)%101)/101,size:7+(i%7)*2.3,angle:i*2.399,shade:['#a6172a','#cb293a','#e04849','#8e152a'][i%4]}));
 return {get moving(){return running||air.moving||water.moving},close(){},draw(ctx){
 const current=state();air.draw(ctx,current);drawStorySpectacle(ctx,current);water.draw(ctx);drawKeepsakes(ctx,current);const {p,w,h,mobile,still,visitor:v}=current,next=p<.045?'opening':p>.967?'ending':'';
 if(next!==scene){scene=next;entered=performance.now()}
 running=false;if(!scene||still)return;
 const elapsed=(performance.now()-entered)/1000;running=elapsed<3.2;
 const entry=smooth(Math.min(1,elapsed/3.2));
 const travel=scene==='opening'?progress(p,0,.045):progress(p,.967,1);
 const opacity=scene==='opening'?1-smooth(progress(p,.03,.045)):smooth(progress(p,.967,.981));
 ctx.save();ctx.globalAlpha=opacity*.8;
 for(const [i,a] of petals.entries()){
 if(mobile&&i>17)break;
 const t=(entry*.5+travel*.6+a.seed*.24),side=scene==='opening'?1:-1;
 let x=w*(scene==='opening'?.84:.77)+side*w*(a.seed-.65)*t+v.x*v.presence*w*.065*(.3+a.seed);
 let y=h*(.26+a.seed*.58)-h*.37*t+Math.sin(a.angle+t*3)*h*.055+v.y*v.presence*h*.025;
 const dx=x-(v.x+1)*w*.5,dy=y-(v.y+1)*h*.5,distance=Math.hypot(dx,dy),push=Math.max(0,1-distance/(w*.45))*v.presence;x+=dx/(distance||1)*push*w*.11;y+=dy/(distance||1)*push*h*.06;
 ctx.save();ctx.translate(x,y);ctx.rotate(a.angle+t*2+push*.5);ctx.scale(1,.6+Math.abs(Math.sin(a.angle+t))*.4);
 ctx.fillStyle=a.shade;ctx.beginPath();ctx.moveTo(0,a.size);ctx.bezierCurveTo(-a.size*1.3,0,-a.size,-a.size,0,-a.size*.65);ctx.bezierCurveTo(a.size,-a.size,a.size*1.3,0,0,a.size);ctx.fill();ctx.strokeStyle='#f18b7344';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(0,a.size);ctx.quadraticCurveTo(-a.size*.25,0,0,-a.size*.6);ctx.stroke();ctx.restore();
 }ctx.restore();
 }};
}
