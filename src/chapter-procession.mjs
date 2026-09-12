import {smooth,progress} from './timeline.mjs';
// Each procession is bound to its scene. Position and opacity retrace on reverse scroll.
export const processions=[
 ['petal',.014,.075],['gold',.17,.224],['ink',.26,.309],['rain',.342,.421],
 ['ink',.445,.53],['gold',.557,.649],['rain',.66,.751],['petal',.827,.896],['gold',.899,.947]
];
export function drawChapterProcession(c,{p,w,h,mobile,still,visitor:v}){
 if(still)return;
 for(const [kind,start,end] of processions){
  if(p<=start||p>=end)continue;
  const t=progress(p,start,end),alpha=smooth(progress(t,0,.16))*(1-smooth(progress(t,.82,1))),count=mobile?48:84;
  c.save();
  for(let i=0;i<count;i++){
   const seed=i*.61803398875%1,depth=.3+(i*.41421356%1)*.7;
   const a=i*2.39996+t*Math.PI*2,orbit=(.33+seed*.32),wind=v.x*v.presence*depth*18;
   // A large helix crosses the scene's lower plane, framing the typography above.
   const x=w*(.5+Math.cos(a)*orbit)+wind,y=h*(.77+Math.sin(a)*.2*depth-(t-.5)*.16);
   const r=(mobile?2.5:3.5)+depth*5;
   c.save();c.translate(x,y);c.rotate(a+t*3);c.globalAlpha=alpha*(.15+depth*.38);
   if(kind==='petal'){
    c.fillStyle=['#a82a3e','#c95048','#e59b77'][i%3];c.beginPath();c.ellipse(0,0,r*1.8,r*.65,0,0,Math.PI*2);c.fill();
   }else if(kind==='ink'){
    c.strokeStyle='#84644e';c.lineWidth=.5+depth*.7;c.beginPath();c.moveTo(-r*3,0);c.bezierCurveTo(-r,-r*2,r,r*2,r*3,0);c.stroke();
   }else{
    c.globalCompositeOperation='screen';c.strokeStyle=kind==='rain'?'#a9d4e6':'#ecd1a1';c.lineWidth=.5+depth;
    c.beginPath();c.moveTo(-r*2,0);c.quadraticCurveTo(0,-r*.8,r*2,0);c.stroke();
    c.globalAlpha*=.6;c.fillStyle=c.strokeStyle;c.beginPath();c.arc(r*2,0,depth*1.5,0,Math.PI*2);c.fill();
   }
   c.restore();
  }
  c.restore();
 }
}
