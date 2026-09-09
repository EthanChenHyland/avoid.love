import {drawPageTurn} from './page-turn.mjs';
import {progress,smooth,mix} from './timeline.mjs';
const gate=(p,a,b,c,d)=>smooth(progress(p,a,b))*(1-smooth(progress(p,c,d)));
const seeds=Array.from({length:64},(_,i)=>({a:i*2.399963,s:((i*47)%67)/67,z:((i*31)%61)/61}));
function flower(c,r,wind){
 c.save();c.strokeStyle='#5b6140';c.lineWidth=1.4;c.beginPath();c.moveTo(-r*.15,r*1.65);c.bezierCurveTo(r*.4,r,r*.22,r*.5,0,0);c.stroke();
 for(const [x,y,turn] of [[r*.13,r*.8,-.3],[r*.04,r*1.12,2.7]]){c.save();c.translate(x,y);c.rotate(turn);c.fillStyle='#6b7050';c.beginPath();c.moveTo(0,0);c.bezierCurveTo(r*.65,-r*.12,r*.75,-r*.6,r*.13,-r*.28);c.fill();c.restore();}
 for(let i=0;i<7;i++){c.save();c.rotate(i*Math.PI*2/7+wind*.06);const g=c.createLinearGradient(0,-r,0,0);g.addColorStop(0,i%2?'#b36b55':'#ba5548');g.addColorStop(.4,i%2?'#a63537':'#b64b42');g.addColorStop(1,'#591c24');c.fillStyle=g;c.beginPath();c.moveTo(0,0);c.bezierCurveTo(-r*.65,-r*.2,-r*.8,-r*.95,0,-r);c.bezierCurveTo(r*.9,-r*1.2,r*.6,-r*.15,0,0);c.fill();c.strokeStyle='#e6b49155';c.lineWidth=.45;for(let j=0;j<4;j++){c.beginPath();c.moveTo(0,0);c.quadraticCurveTo((j-1.5)*r*.13,-r*.4,(j-1.5)*r*.2,-r*.8);c.stroke()}c.restore()}
 c.fillStyle='#36262a';c.beginPath();c.ellipse(0,0,r*.2,r*.16,0,0,Math.PI*2);c.fill();c.restore();
}
function paper(c,x,y,w,h){const g=c.createLinearGradient(x,y,x+w,y);g.addColorStop(0,'#c8b590');g.addColorStop(.12,'#eadabe');g.addColorStop(.8,'#e3d1b0');g.addColorStop(1,'#b6a17d');c.fillStyle=g;c.fillRect(x,y,w,h);c.strokeStyle='#6f58381c';c.lineWidth=.5;for(let i=0;i<18;i++){c.beginPath();c.moveTo(x+w*.1,y+h*(.12+i*.045));c.lineTo(x+w*.9,y+h*(.12+i*.045));c.stroke()}}
export function materialScenes(){
 // A single small sampling surface keeps droplet refraction independent of canvas DPR.
 const book=document.createElement('canvas'),bookContext=book.getContext('2d');
 const lens=document.createElement('canvas');lens.width=lens.height=96;const lc=lens.getContext('2d');
 return {draw(c,{p,w,h,mobile,still,visitor:v}){const wind=still?0:v.x*v.presence,hand=still?0:v.presence;
 // A book opens in place; the pressed poppy retains the story's red material palette.
 let alpha=gate(p,.283,.293,.304,.313);
 if(alpha){const t=still?1:smooth(progress(p,.291,.303)),bw=Math.min(w*(mobile?.70:.34),h*.50),bh=bw*.60,x=w*(mobile?.61:.76),y=h*(mobile?.72:.62);
 const stage=c,bwCanvas=Math.ceil(bw*1.7),bhCanvas=Math.ceil(bh*2+70);if(book.width!==bwCanvas*2||book.height!==bhCanvas*2){book.width=bwCanvas*2;book.height=bhCanvas*2}c=bookContext;c.setTransform(2,0,0,2,0,0);c.clearRect(0,0,bwCanvas,bhCanvas);
 c.save();c.globalAlpha=1;c.translate(bwCanvas/2,bhCanvas*.4);c.rotate(-.11+wind*.08);c.transform(1,.04,wind*.05,1,0,0);c.shadowColor='#0c0808bb';c.shadowBlur=24;c.shadowOffsetY=12;c.fillStyle='#594638';c.fillRect(-bw*.52,-bh*.53,bw*1.04,bh*1.07);c.shadowColor='transparent';paper(c,-bw/2,-bh/2,bw/2,bh);paper(c,0,-bh/2,bw/2,bh);
 c.save();c.translate(bw*.24,-bh*.09);flower(c,bh*.22,wind);c.restore();c.fillStyle='#745b43';c.font=`italic ${Math.max(10,bw*.037)}px Bodoni,serif`;c.textAlign='center';c.fillText('one small thing.',-bw*.25,bh*.18,bw*.41);c.fillStyle='#977b5366';c.fillRect(-1,-bh/2,2,bh);
 drawPageTurn(c,t,bw/2,bh,wind);
 c.strokeStyle='#9e3935';c.lineWidth=2;c.beginPath();c.moveTo(-bw*.06,bh*.08);c.bezierCurveTo(-bw*.04,bh*.4,-bw*.09,bh*.6,bw*.02,bh*.75);c.stroke();c.restore();c=stage;c.save();c.globalAlpha=1;c.drawImage(book,x-bwCanvas/2,y-bhCanvas*.4+(1-alpha)*(h+bh),bwCanvas,bhCanvas);c.restore();}
 if(still)return;
 // A wax seal gathers over the words that never left the room.
 alpha=gate(p,.511,.523,.537,.547);
 if(alpha){const t=smooth(progress(p,.511,.531)),r=Math.min(w*.11,52),x=w*(mobile?.76:.79),y=h*.72;c.save();c.translate(x,y);c.rotate(wind*.12);c.globalAlpha=alpha;c.shadowColor='#26121077';c.shadowBlur=10;c.shadowOffsetY=4;const wax=c.createRadialGradient(-r*.35,-r*.4,r*.1,0,0,r);wax.addColorStop(0,'#c47963');wax.addColorStop(.35,'#a84840');wax.addColorStop(1,'#632c30');c.fillStyle=wax;c.beginPath();for(let i=0;i<=80;i++){const a=i*Math.PI/40,edge=r*(.95+.04*Math.sin(a*11));i?c.lineTo(Math.cos(a)*edge,Math.sin(a)*edge):c.moveTo(edge,0)}c.closePath();c.fill();c.shadowColor='transparent';c.strokeStyle='#e2a78588';c.lineWidth=1;c.beginPath();c.arc(0,0,r*.72,-Math.PI/2,-Math.PI/2+t*Math.PI*2);c.stroke();c.strokeStyle='#532127';c.lineWidth=2;c.beginPath();c.moveTo(0,r*.34);c.bezierCurveTo(-r*.85,-r*.12,-r*.35,-r*.58,0,-r*.21);c.bezierCurveTo(r*.35,-r*.58,r*.85,-r*.12,0,r*.34);c.stroke();c.restore();}
 // A small brass key turns in the returning light, its shadow anchored to the drawer.
 alpha=gate(p,.788,.799,.813,.824);
 if(alpha){const t=progress(p,.788,.824),size=Math.min(w*.14,70),x=w*(mobile?.76:.80),y=h*.72;c.save();c.globalAlpha=alpha;c.translate(x,y);c.rotate(-.5+t*.9+wind*.25);c.scale(.65+.35*Math.cos(t*Math.PI),1);c.shadowColor='#100d0c88';c.shadowBlur=8;c.shadowOffsetY=6;const metal=c.createLinearGradient(-size/2,0,size/2,0);metal.addColorStop(0,'#8c6132');metal.addColorStop(.45,'#ebd3a0');metal.addColorStop(.6,'#a77b42');metal.addColorStop(1,'#d5ad6e');c.strokeStyle=metal;c.lineWidth=size*.13;c.beginPath();c.ellipse(0,-size*.44,size*.25,size*.32,0,0,Math.PI*2);c.moveTo(0,-size*.12);c.lineTo(0,size*.76);c.moveTo(0,size*.65);c.lineTo(size*.26,size*.65);c.moveTo(0,size*.42);c.lineTo(size*.20,size*.42);c.stroke();c.restore();}
 // Rain droplets genuinely magnify the film underneath, without a fullscreen image swap.
 alpha=gate(p,.350,.366,.411,.422);
 if(alpha){const t=progress(p,.35,.422),sx=c.canvas.width/w,sy=c.canvas.height/h;
 for(let i=0;i<(mobile?8:14);i++){const s=seeds[i],r=3+s.z*(mobile?8:11),x=w*(.48+s.s*.48)+wind*10*s.z,y=h*(.10+s.z*.46+t*.08),sample=r*1.55;
 lc.clearRect(0,0,96,96);lc.drawImage(c.canvas,(x-sample)*sx,(y-sample)*sy,sample*2*sx,sample*2*sy,0,0,96,96);c.save();c.globalAlpha=alpha*.58;c.beginPath();c.ellipse(x,y,r,r*1.4,0,0,Math.PI*2);c.clip();c.drawImage(lens,x-r*1.22,y-r*1.55,r*2.44,r*3.1);const shade=c.createLinearGradient(x-r,y-r,x+r,y+r);shade.addColorStop(0,'#f2fcff55');shade.addColorStop(.35,'transparent');shade.addColorStop(1,'#14262c55');c.fillStyle=shade;c.fillRect(x-r,y-r*1.4,r*2,r*2.8);c.restore();}
 }
 // Headlights drift through the lower pane while a constellation traces the rainy evening.
 alpha=gate(p,.386,.399,.413,.423);
 if(alpha){const t=progress(p,.386,.423);c.save();c.globalCompositeOperation='screen';
 for(let i=0;i<(mobile?16:28);i++){const s=seeds[i],x=w*((s.s+t*.27)%1.3-.15)+wind*w*.035,y=h*(.62+s.z*.25),r=3+s.z*12;const g=c.createRadialGradient(x,y,0,x,y,r*2);g.addColorStop(0,i%3?'#d8b994aa':'#80adcc99');g.addColorStop(.35,i%3?'#b7835944':'#658dc544');g.addColorStop(1,'transparent');c.globalAlpha=alpha*.45;c.fillStyle=g;c.fillRect(x-r*2,y-r*2,r*4,r*4)}
 c.globalAlpha=alpha*.3;c.strokeStyle='#d8dfd4';c.lineWidth=.6;c.beginPath();for(let i=0;i<8;i++){const u=i/7,x=w*(.1+u*.8),y=h*(.68+Math.sin(u*8+t*2)*.07);i?c.lineTo(x,y):c.moveTo(x,y);c.moveTo(x+2,y);c.arc(x,y,2,0,Math.PI*2);c.moveTo(x,y)}c.stroke();c.restore();}
 // Two fields of thread bow around the empty seat: touch pulls them toward one another.
 alpha=gate(p,.714,.730,.743,.754);
 if(alpha){const t=progress(p,.714,.754);c.save();c.lineWidth=.8;for(let i=0;i<(mobile?16:26);i++){const u=i/(mobile?15:25),y=h*(.56+u*.28),reach=w*(.24+hand*.08),curl=Math.sin(u*6+t*4)*h*.035;c.globalAlpha=alpha*(.12+Math.sin(u*Math.PI)*.25);c.strokeStyle=i%4?'#c18c79':'#efc99b';c.beginPath();c.moveTo(-10,y);c.bezierCurveTo(w*.14,y-h*.07,reach+wind*20,y+curl,reach,y);c.moveTo(w+10,y);c.bezierCurveTo(w*.86,y+h*.07,w-reach+wind*20,y-curl,w-reach,y);c.stroke()}c.restore();}
 // Paper birds leave the letters behind and travel into the final light.
 alpha=gate(p,.902,.924,.974,.995);
 if(alpha){const t=progress(p,.902,.995),birds=seeds.slice(0,mobile?10:18).map((s,i)=>({s,i,depth:.2+s.z*.8})).sort((a,b)=>a.depth-b.depth);c.save();
 for(const {s,i,depth} of birds){const x=w*(s.s*.9+.05)+Math.sin(s.a+t*2)*w*.05+wind*w*.08*depth,y=h*(.87-s.z*.24-t*.68),size=(mobile?18:28)*depth,flap=Math.sin(t*24+s.a)*.45;c.save();c.translate(x,y);c.rotate(-.3+Math.sin(s.a+t)*.3);c.globalAlpha=alpha*(.18+depth*.46);c.fillStyle=i%2?'#eadfc9':'#cbbfaa';c.beginPath();c.moveTo(-size,0);c.lineTo(-size*.25,-size*(.7+flap));c.lineTo(size*.08,0);c.lineTo(size,-size*(.45-flap));c.lineTo(size*.22,size*.15);c.lineTo(0,size*.09);c.closePath();c.fill();c.fillStyle='#9f8c7377';c.beginPath();c.moveTo(-size,0);c.lineTo(0,size*.09);c.lineTo(-size*.25,-size*(.7+flap));c.closePath();c.fill();c.restore()}c.restore();}
 // Petal-shaped shadows echo the flower across the final table, moving with the visitor.
 alpha=smooth(progress(p,.980,1));if(alpha){c.save();c.globalCompositeOperation='multiply';for(let i=0;i<6;i++){const a=i*.71+wind*.3;c.save();c.translate(w*(.7+Math.cos(a)*.15),h*(.86+Math.sin(a)*.055));c.rotate(a);c.scale(1,.23);c.globalAlpha=alpha*.07;c.fillStyle='#7d503e';c.beginPath();c.ellipse(0,0,w*.12,h*.055,0,0,Math.PI*2);c.fill();c.restore()}c.restore();}
 }};
}
