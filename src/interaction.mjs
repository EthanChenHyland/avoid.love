import {clamp,progress,smooth,mix} from './timeline.mjs';
// Shared, settling pointer state. No perpetual loop, sensors, or essential hover state.
export class Visitor {
 constructor(){this.x=0;this.y=0;this.tx=0;this.ty=0;this.presence=0;this.targetPresence=0}
 move(x,y,w,h){this.tx=clamp(x/w*2-1,-1,1);this.ty=clamp(y/h*2-1,-1,1);this.targetPresence=1}
 leave(){this.tx=0;this.ty=0;this.targetPresence=0}
 step(dt,enabled){if(!enabled){this.x=this.y=this.tx=this.ty=this.presence=this.targetPresence=0;return false}const k=1-Math.exp(-dt/140);let moving=false;for(const [a,b] of [['x','tx'],['y','ty'],['presence','targetPresence']]){this[a]+= (this[b]-this[a])*k;if(Math.abs(this[b]-this[a])<.001)this[a]=this[b];else moving=true}return moving}
}
export function depthAmount(p){return Math.max(envelope(p,.255,.268,.296,.307),envelope(p,.968,.985,1.01,1.02))}
const envelope=(p,a,b,c,d)=>smooth(progress(p,a,b))*(1-smooth(progress(p,c,d)));
export function gradeCopy(ctx,w,h,p){
 // Local exposure protects essential text during bright paper and photo passages.
 const amount=Math.max(envelope(p,.42,.44,.53,.55)*.2,envelope(p,.82,.84,.916,.93)*.5,envelope(p,.31,.335,.41,.435)*.15);
 if(!amount)return;ctx.save();const g=ctx.createLinearGradient(0,0,w*.65,0);g.addColorStop(0,`rgba(4,12,15,${amount})`);g.addColorStop(.6,`rgba(4,12,15,${amount*.8})`);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.restore();
}
let paneTexture;
function windowPane(){
 if(paneTexture)return paneTexture;
 const c=document.createElement('canvas');c.width=320;c.height=96;const g=c.getContext('2d');
 const falloff=g.createLinearGradient(0,0,0,96);falloff.addColorStop(0,'transparent');falloff.addColorStop(.15,'#ffcf94');falloff.addColorStop(.75,'#ffdfae');falloff.addColorStop(1,'transparent');g.fillStyle=falloff;g.fillRect(0,0,320,96);
 g.globalCompositeOperation='destination-in';const edge=g.createLinearGradient(0,0,320,0);edge.addColorStop(0,'transparent');edge.addColorStop(.25,'#000');edge.addColorStop(.6,'#000');edge.addColorStop(1,'transparent');g.fillStyle=edge;g.fillRect(0,0,320,96);paneTexture=c;return c;
}
export function letterLight(ctx,w,h,p,v,mobile){
 const a=envelope(p,.443,.461,.516,.534)*v.presence;if(a<.001)return;
 ctx.save();ctx.beginPath();ctx.moveTo(w*(mobile?0:.30),h*.97);ctx.lineTo(w*(mobile?.50:.63),h*.14);ctx.lineTo(w,h*.31);ctx.lineTo(w,h);ctx.closePath();ctx.clip();
 // Three projected window panes: oblique incidence and dark mullions, not a cursor halo.
 ctx.translate(w*(.7+v.x*.075),h*(.55+v.y*.065));ctx.transform(1,.13+v.x*.035,-.38+v.x*.12,1,0,0);
 ctx.globalCompositeOperation='screen';
 ctx.globalAlpha=a*.18;
 for(let pane=0;pane<3;pane++)ctx.drawImage(windowPane(),-w*.21,-h*.25+pane*h*.17,w*.42,h*.16);
 ctx.globalAlpha=1;
 ctx.globalCompositeOperation='multiply';ctx.fillStyle=`rgba(75,39,18,${a*.10})`;ctx.fillRect(-w*.01,-h*.25,w*.012,h*.48);ctx.restore();
}
const threadKeys=[
 // Object anchors: vase/table, keepsake, cups, empty seats, memory, final table.
 [.163,.82,.67,.94,.88,0],[.185,.81,.68,.96,.88,1],[.225,.83,.73,.96,.92,0],
 [.25,.65,.65,.87,.83,0],[.273,.68,.64,.87,.84,1],[.302,.73,.72,.94,.89,0],
 [.565,.75,.74,.93,.86,0],[.59,.71,.77,.94,.86,1],[.637,.76,.79,.95,.87,0],
 [.669,.35,.85,.79,.85,0],[.70,.28,.85,.86,.85,1],[.745,.18,.85,.95,.85,1],[.778,.18,.85,.95,.85,0],
 [.839,.73,.81,.96,.89,0],[.872,.72,.79,.94,.86,1],[.90,.74,.82,.97,.90,0],
 [.971,.69,.80,.91,.81,0],[1,.69,.80,.91,.81,1]
];
export function threadState(p){if(p<threadKeys[0][0])return null;let i=0;while(i<threadKeys.length-2&&threadKeys[i+1][0]<p)i++;const a=threadKeys[i],b=threadKeys[i+1],t=smooth(progress(p,a[0],b[0]));return a.slice(1).map((v,j)=>mix(v,b[j+1],t))}
export function redThread(ctx,w,h,p,v,mobile,still){
 const s=threadState(p);if(!s||s[4]<.01)return;let [x1,y1,x2,y2,opacity]=s;
 // Mobile stays near the paired objects and clear of lower captions and touch controls.
 if(mobile){x1=.55;x2=.87;y1=p>.965?.79:p<.23?.74:.73;y2=y1+.035;if(p>.64&&p<.8){y1=.79;y2=.79}}
 const tension=progress(p,.65,.75),bend=(1-tension)*(mobile?12:26),dx=still?0:v.x*(mobile?3:8),dy=still?0:v.y*6;
 ctx.save();ctx.globalAlpha=opacity*(mobile?.8:.9);ctx.lineCap='round';
 const path=(offset)=>{ctx.beginPath();ctx.moveTo(w*x1,h*y1+offset);ctx.bezierCurveTo(w*x1+w*.06+dx,h*y1+bend+dy+offset,w*x2-w*.07-dx,h*y2+bend*.4+offset,w*x2,h*y2+offset)};
 path(2);ctx.strokeStyle='#240b06';ctx.lineWidth=mobile?2.5:3;ctx.globalAlpha*=.35;ctx.stroke();ctx.globalAlpha=opacity*.9;
 path(0);ctx.strokeStyle='#a52220';ctx.lineWidth=mobile?1.6:2.2;ctx.stroke();
 path(-.35);ctx.strokeStyle='#ed7255';ctx.lineWidth=.65;ctx.globalAlpha*=.65;ctx.stroke();ctx.restore();
}
