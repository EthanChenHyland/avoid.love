import {progress,smooth} from './timeline.mjs';
const gate=(p,a,b,c,d)=>smooth(progress(p,a,b))*(1-smooth(progress(p,c,d)));
export function drawExpansionScenes(c,{p,w,h,mobile,still,visitor:v}){
 const wind=still?0:v.x*v.presence;
 let alpha=gate(p,.307,.314,.320,.327);
 if(alpha){const t=progress(p,.309,.324),width=Math.min(w*(mobile?.65:.3),h*.45),height=width*.5;
 c.save();c.translate(w*(mobile?.6:.76),h*.72+(1-alpha)*(h+height));c.rotate(-.15+wind*.1);
 c.shadowColor='#10080588';c.shadowBlur=16;c.shadowOffsetY=8;c.fillStyle='#e0cba9';c.fillRect(-width/2,-height/2,width,height);c.shadowColor='transparent';
 c.strokeStyle='#80674955';c.lineWidth=.6;for(let i=0;i<8;i++){c.beginPath();c.moveTo(-width*.4,-height*.35+i*height*.085);c.lineTo(width*.3,-height*.35+i*height*.085);c.stroke()}
 const fold=smooth(progress(t,.3,.9)),edge=width*.48*(1-fold);c.fillStyle='#c2aa84';c.beginPath();c.moveTo(width/2,-height/2);c.lineTo(edge,-height*.45);c.lineTo(edge,height*.5);c.lineTo(width/2,height/2);c.closePath();c.fill();
 c.strokeStyle='#a63838';c.lineWidth=1.6;c.beginPath();c.moveTo(-width*.46,height*.22);c.bezierCurveTo(-width*.13,height*.1,width*.2,height*.36,width*.45,height*(.18+wind*.07));c.stroke();c.restore();}
 alpha=gate(p,.700,.709,.716,.723);
 if(alpha){const t=progress(p,.704,.72),left=w*(mobile?.12:.58),right=w*(mobile?.88:.92),y=h*.70;
 c.save();c.globalAlpha=alpha;c.strokeStyle='#e5d1af88';c.lineWidth=1;c.beginPath();c.moveTo(left,y);c.lineTo(right,y);c.stroke();
 for(let i=0;i<7;i++){const x=left+(right-left)*i/6,near=still?0:Math.max(0,1-Math.abs(x/w-(v.x+1)/2)*7)*v.presence;c.fillStyle=i/6<t?'#b44b43':'#d8c4a6';c.beginPath();c.arc(x,y-near*12,3+near*2,0,Math.PI*2);c.fill();}
 c.fillStyle='#f6d994';c.shadowColor='#f6d994';c.shadowBlur=12;c.beginPath();c.arc(left+(right-left)*smooth(t),y,4,0,Math.PI*2);c.fill();c.restore();}
 alpha=gate(p,.595,.602,.609,.617);
 if(alpha){const t=progress(p,.595,.617);c.save();c.globalAlpha=alpha*.22;c.globalCompositeOperation='screen';
 for(let i=0;i<9;i++){const x=w*(.5+i*.053)+wind*w*.025,y=h*(.62+(i%3)*.08),length=h*(.08+.04*Math.sin(t*6+i));const g=c.createLinearGradient(x,y,x,y+length);g.addColorStop(0,'#edc388');g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(x,y,1.5+i%3,length)}c.restore();}
}
