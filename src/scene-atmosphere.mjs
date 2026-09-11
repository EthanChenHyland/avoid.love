import {smooth,progress} from './timeline.mjs';
// Scroll-driven, reversible light and material motion. No independent animation loop.
export const atmosphereRanges=[['steam',.225,.229,.237,.242],['paper',.309,.313,.319,.324],['rain',.598,.602,.609,.614],['train',.704,.708,.715,.720],['morning',.988,.991,.994,.997]];
export function atmosphereState(p,still=false){
 if(still)return [];
 return atmosphereRanges.map(([id,a,b,c,d])=>({id,t:progress(p,a,d),alpha:smooth(progress(p,a,b))*(1-smooth(progress(p,c,d)))})).filter(s=>s.alpha>0);
}
export function drawSceneAtmosphere(c,{p,w,h,mobile,still,visitor:v}){
 const wind=v.x*v.presence;
 for(const {id,t,alpha} of atmosphereState(p,still)){
  c.save();c.globalAlpha=alpha;
  if(id==='steam'){
   c.globalCompositeOperation='screen';
   for(let i=0;i<5;i++){
    const x=w*(mobile?.18:.72)+i*w*.013,y=h*.69,reach=h*(.23+t*.12);
    const g=c.createLinearGradient(x,y,x,y-reach);g.addColorStop(0,'#f5e2c400');g.addColorStop(.35,'#f5e2c445');g.addColorStop(1,'#f5e2c400');c.strokeStyle=g;c.lineWidth=1+i*.8;
    c.beginPath();for(let j=0;j<=40;j++){const u=j/40,px=x+Math.sin(u*9-t*7+i*.8)*w*.013*u+wind*w*.035*u,py=y-u*reach;j?c.lineTo(px,py):c.moveTo(px,py)}c.stroke();
   }
  }else if(id==='paper'){
   // A blind-embossed circular impression forms on the lower material plane.
   c.translate(w*(mobile?.67:.79),h*.82);c.transform(1,.08,-.25,.36,0,0);c.rotate(-.1+wind*.04);
   const radius=Math.min(w*.22,h*.19);c.lineWidth=1;c.strokeStyle='#d3b48b44';
   for(let i=0;i<3;i++){c.beginPath();c.arc(0,0,radius*(.72+i*.14),-.5,Math.PI*2*smooth(t)-.5);c.stroke();}
   for(let i=0;i<24;i++){const a=i*Math.PI/12;if(i/24>smooth(t))break;c.beginPath();c.moveTo(Math.cos(a)*radius*.78,Math.sin(a)*radius*.78);c.lineTo(Math.cos(a)*radius*.87,Math.sin(a)*radius*.87);c.stroke();}
  }else if(id==='rain'){
   c.globalCompositeOperation='screen';
   for(let i=0;i<(mobile?12:22);i++){
    const seed=(i*.61803398875)%1,phase=(t*2+seed)%1,life=Math.sin(Math.PI*phase)**2;
    const x=w*(.12+((i*.381966)%1)*.84)+wind*5,y=h*(.76+((i*.754877)%1)*.20),r=(8+phase*35)*(mobile?.6:1);
    c.globalAlpha=alpha*life*.24;c.strokeStyle=i%3?'#deb981':'#b6d4dc';c.lineWidth=.7;c.beginPath();c.ellipse(x,y,r,r*.18,0,0,Math.PI*2);c.stroke();
   }
  }else if(id==='train'){
   c.globalCompositeOperation='screen';
   // Broad feathered pools pass across the existing window, never hard rectangles.
   for(let i=0;i<4;i++){
    const x=w*(1.35-t*1.8+i*.22)+wind*w*.02,y=h*.35,r=w*.24;
    const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'#f7ca8840');g.addColorStop(.3,'#b4d5dd18');g.addColorStop(1,'#b4d5dd00');c.fillStyle=g;c.fillRect(0,0,w,h);
   }
  }else if(id==='morning'){
   // Sun through leaves: soft moving shadows, anchored to the tabletop.
   const x=w*(.82-t*.07)+wind*w*.025,y=h*.77;
   for(let i=0;i<9;i++){
    c.save();c.translate(x+Math.sin(i*2.4+t)*w*.12,y+Math.cos(i*1.7+t)*h*.13);c.rotate(i*.7+t*.25);c.scale(1,.35);
    const r=Math.min(w*.13,h*.10),g=c.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,'#44352132');g.addColorStop(.45,'#44352120');g.addColorStop(1,'#44352100');c.fillStyle=g;c.fillRect(-r,-r,r*2,r*2);c.restore();
   }
   c.globalCompositeOperation='screen';const g=c.createRadialGradient(w*.87,h*.56,0,w*.87,h*.56,w*.5);g.addColorStop(0,'#ffd5a41c');g.addColorStop(1,'#ffd5a400');c.fillStyle=g;c.fillRect(0,0,w,h);
  }
  c.restore();
 }
}
