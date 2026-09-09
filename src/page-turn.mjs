import {clamp} from './timeline.mjs';
/** Inextensible strips: integrate a changing tangent along the leaf, hinged at the spine. */
export function pageShape(t,width,height,wind=0,segments=36){
 t=clamp(t);let x=0,z=0;const points=[{x:0,z:0,angle:Math.PI*t}];
 for(let i=1;i<=segments;i++){const u=(i-.5)/segments,angle=Math.PI*t+Math.sin(Math.PI*t)*(.95*(u-.5)+wind*.08*u);x+=Math.cos(angle)*width/segments;z+=Math.sin(angle)*width/segments;points.push({x,z,angle})}
 return points.map(a=>({...a,top:-height/2-a.z*.32-a.z*height/width*.07,bottom:height/2-a.z*.32+a.z*height/width*.07}));
}
export function drawPageTurn(c,t,width,height,wind=0){
 const points=pageShape(t,width,height,wind),lift=Math.sin(Math.PI*t);c.save();
 // A soft contact shadow grows under the lifted leaf and contracts as it lands.
 c.save();c.shadowColor='#26170b77';c.shadowBlur=3+lift*13;c.shadowOffsetX=lift*width*.12;c.shadowOffsetY=lift*10;c.fillStyle=`rgba(47,30,14,${.10+lift*.11})`;c.beginPath();c.moveTo(0,-height/2);for(const p of points)c.lineTo(p.x+p.z*.18,-height/2+p.z*.10);for(const p of [...points].reverse())c.lineTo(p.x+p.z*.18,height/2+p.z*.10);c.closePath();c.fill();c.restore();
 for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1],light=.5+.5*Math.cos(a.angle-.65),back=Math.cos(a.angle)<0;c.fillStyle=`rgb(${Math.round(202+light*36)} ${Math.round(182+light*35)} ${Math.round(148+light*34)})`;c.beginPath();c.moveTo(a.x,a.top);c.lineTo(b.x,b.top);c.lineTo(b.x,b.bottom);c.lineTo(a.x,a.bottom);c.closePath();c.fill();c.strokeStyle=c.fillStyle;c.lineWidth=.55;c.stroke();
 c.strokeStyle=back?'#846e4a25':'#80684318';c.lineWidth=.5;for(let row=0;row<17;row++){const v=.13+row*.043;c.beginPath();c.moveTo(a.x,a.top+(a.bottom-a.top)*v);c.lineTo(b.x,b.top+(b.bottom-b.top)*v);c.stroke()}}
 const tip=points.at(-1);c.strokeStyle='#ad9771';c.lineWidth=.65;c.beginPath();c.moveTo(tip.x,tip.top);c.lineTo(tip.x,tip.bottom);c.stroke();c.restore();
}
