import {progress,smooth} from './timeline.mjs';
const envelope=(p,a,b,c,d)=>smooth(progress(p,a,b))*(1-smooth(progress(p,c,d)));
/** Small scene-bound simulations. Shared clock, passive pointer state, no launchers. */
export function atmosphere(){
 let scene='',entered=0,running=false;
 return {get moving(){return running},draw(ctx,{p,w,h,mobile,still,visitor:v}){
 const next=p>.158&&p<.226?'coffee':p>.34&&p<.414?'rain':p>.973?'morning':'';
 if(next!==scene){scene=next;entered=performance.now()}
 running=false;if(!scene||still)return;
 const elapsed=(performance.now()-entered)/1000;running=elapsed<4.5;
 const time=Math.min(elapsed,4.5),wind=v.x*v.presence;
 ctx.save();
 if(scene==='rain'){
 const a=envelope(p,.34,.353,.401,.414),drift=progress(p,.34,.414)*.23+time*.012;
 ctx.beginPath();ctx.rect(w*(mobile?.44:.56),h*.08,w*(mobile?.53:.4),h*.59);ctx.clip();
 for(let i=0;i<(mobile?16:26);i++){
 const x=w*(.46+((i*37)%101)/101*.5),y=h*(.11+((i*61)%101)/101*.44+drift),length=h*(.025+(i%4)*.016);
 const near=Math.max(0,1-Math.abs(x/w-(v.x+1)/2)*8)*v.presence;
 ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+wind*near*18,y+length*.5,x+wind*near*28,y+length);
 ctx.strokeStyle=`rgba(215,230,224,${a*(.10+(i%3)*.025)})`;ctx.lineWidth=.7+(i%3)*.4;ctx.stroke();
 ctx.beginPath();ctx.ellipse(x+wind*near*28,y+length,1.5,3,0,0,Math.PI*2);ctx.fillStyle=`rgba(220,232,226,${a*.22})`;ctx.fill();
 }
 }else{
 const morning=scene==='morning',a=morning?smooth(progress(p,.973,.992)):envelope(p,.158,.178,.213,.226);
 const cups=mobile?(morning?[[.18,.70],[.90,.73]]:[[.40,.695],[.68,.745]]):(morning?[[.65,.82],[.83,.82]]:[[.73,.69],[.88,.74]]);
 for(const [index,[x,y]] of cups.entries())for(let strand=0;strand<3;strand++){
 const height=h*(mobile?.075:.11),phase=time*.9+strand*1.7+index;
 ctx.beginPath();for(let step=0;step<=24;step++){const t=step/24,xx=w*x+Math.sin(t*5+phase)*w*.009*t+wind*t*t*w*.045,yy=h*y-height*t;step?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)}
 const fade=ctx.createLinearGradient(0,h*y,0,h*y-height);fade.addColorStop(0,'transparent');fade.addColorStop(.25,`rgba(248,236,210,${a*.16})`);fade.addColorStop(.75,`rgba(248,236,210,${a*.09})`);fade.addColorStop(1,'transparent');ctx.strokeStyle=fade;ctx.lineWidth=mobile?1.6:2.3;ctx.lineCap='round';ctx.stroke();
 }
 }
 ctx.restore();
 }};
}
