import {progress,smooth} from './timeline.mjs';
const gate=(p,a,b,c,d)=>smooth(progress(p,a,b))*(1-smooth(progress(p,c,d)));
const seeds=Array.from({length:80},(_,i)=>({a:i*2.399963,s:((i*47)%83)/83,z:((i*31)%79)/79}));
function petal(c,size){
 const shade=c.fillStyle,g=c.createLinearGradient(-size,-size,size,size);g.addColorStop(0,'#f37969');g.addColorStop(.35,shade);g.addColorStop(1,'#690f24');c.fillStyle=g;
 c.beginPath();c.moveTo(0,size);c.bezierCurveTo(-size*1.5,-size*.1,-size*.7,-size,0,-size*.65);c.bezierCurveTo(size*1.2,-size,size*1.3,size*.1,0,size);c.fill();
 c.strokeStyle='#ffc0a955';c.lineWidth=.6;c.beginPath();c.moveTo(0,size);c.quadraticCurveTo(-size*.25,0,0,-size*.65);c.stroke();
}
/** Entirely scroll-driven choreography; no independent loop or additional image cache. */
export function drawStorySpectacle(c,{p,w,h,mobile,still,visitor:v}){
 if(still)return;
 const wind=v.x*v.presence,tilt=v.y*v.presence;
 // Foreground petals spiral past the lens, then clear before the film join.
 let alpha=gate(p,.008,.022,.048,.060);
 if(alpha>0){const t=progress(p,.008,.060);c.save();
 for(let i=0;i<(mobile?36:64);i++){
  const s=seeds[i],angle=s.a+t*4.5,depth=.2+s.z*.8,radius=(.12+s.s*.64)*(1+t*.65);
  const x=w*(.72+Math.cos(angle)*radius)+wind*w*.1*depth,y=h*(.48+Math.sin(angle)*radius*.85)+tilt*h*.08*depth;
  c.save();c.translate(x,y);c.rotate(angle+t*2);c.scale(1,.25+Math.abs(Math.cos(angle))*.75);c.globalAlpha=alpha*(.25+depth*.65);c.fillStyle=['#ba172e','#e5464a','#94152a','#d92b3c'][i%4];petal(c,(mobile?9:15)*( .5+depth*2.5));c.restore();
 }c.restore();}
 // A luminous ribbon connects memories, with sparks pushed aside by a hand.
 alpha=gate(p,.553,.568,.632,.649);
 if(alpha>0){const t=progress(p,.553,.649),points=[];c.save();c.globalCompositeOperation='screen';
 for(let i=0;i<64;i++){const u=i/63,x=w*u,y=h*(.77+Math.sin(u*8-t*7)*.09)+tilt*h*.035;const dx=x-(v.x+1)*w*.5,dy=y-(v.y+1)*h*.5,push=Math.max(0,1-Math.hypot(dx,dy)/(w*.3))*v.presence;points.push([x+dx*push*.23,y+dy*push*.3]);}
 for(const [width,opacity] of [[12,.045],[4,.12],[1,.7]]){c.strokeStyle=`rgba(255,199,125,${alpha*opacity})`;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
 for(let i=0;i<(mobile?26:46);i++){const s=seeds[i],u=(s.s+t*.35)%1,j=Math.min(62,Math.floor(u*63)),[x,y]=points[j],r=1+s.z*2;c.globalAlpha=alpha*(.25+s.z*.6);c.fillStyle='#ffe9b8';c.beginPath();c.arc(x,y+Math.sin(s.a+t*9)*(8+s.z*28),r,0,Math.PI*2);c.fill();}c.restore();}
 // Unsent words leave branching ink along the paper's lower margin.
 alpha=gate(p,.446,.46,.514,.535);
 if(alpha>0){const t=progress(p,.446,.535);c.save();c.strokeStyle='#472324';c.globalAlpha=alpha*.5;c.lineCap='round';
 for(let i=0;i<11;i++){const s=seeds[i],x=w*(.72+s.s*.22),y=h*.84;c.lineWidth=.5+s.z;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x-w*.08*t,y-h*.05,x+w*(wind*.04-.03)*t,y-h*.12*t,x+w*.05*Math.sin(s.a+t*2),y-h*(.04+s.z*.13)*smooth(t));c.stroke();}c.restore();}
 // Letters rush through a deep orbit at the edge of the frame, leaving room for copy.
 alpha=Math.max(gate(p,.675,.69,.734,.749),gate(p,.834,.846,.875,.889));
 if(alpha>0){const t=p<.8?progress(p,.675,.749):progress(p,.834,.889);c.save();
 for(let i=0;i<(mobile?14:24);i++){const s=seeds[i],angle=s.a+t*5,depth=.25+s.z*.75,side=i%2?1:-1;
 const x=w*(side>0?.94:.06)+Math.cos(angle)*w*.12+wind*w*.065*depth,y=h*((s.s+t*.75)%1.4-.2),size=(mobile?54:85)*depth*(1+t*.6);
 c.save();c.translate(x,y);c.rotate(Math.sin(angle)*.8+side*t);c.scale(.35+Math.abs(Math.cos(angle))*.65,1);c.globalAlpha=alpha*(.35+depth*.55);c.shadowColor='#100b0a55';c.shadowBlur=depth*10;c.shadowOffsetY=depth*5;c.fillStyle=i%3?'#e5cba5':'#f4e5ca';c.fillRect(-size/2,-size*.34,size,size*.68);c.shadowColor='transparent';c.strokeStyle='#89624d';c.lineWidth=.65;c.beginPath();c.moveTo(-size/2,-size*.34);c.lineTo(0,size*.06);c.lineTo(size/2,-size*.34);c.stroke();c.restore();
 }c.restore();}
 // The final sunlight breaks into a field of warm, hand-responsive motes.
 alpha=smooth(progress(p,.966,.988));
 if(alpha>0){const t=progress(p,.966,1);c.save();c.globalCompositeOperation='screen';
 for(let i=0;i<(mobile?34:64);i++){const s=seeds[i],x=w*(s.s+Math.sin(s.a+t*3)*.04+wind*.025*s.z),y=h*(s.z-t*.13+tilt*.025);c.globalAlpha=alpha*(.15+s.s*.45);c.fillStyle='#ffe8a9';c.beginPath();c.ellipse(x,y,1+s.s*2,2+s.s*5,s.a+t,0,Math.PI*2);c.fill();}c.restore();}
}
