import {progress,smooth} from './timeline.mjs';
/** Opaque stationery with an ink route, pressed stamp and a lifted corner. */
export function drawPostcard(c,{p,w,h,mobile,still,visitor:v}){
 if(p<=.528||p>=.549)return;
 const entrance=smooth(progress(p,.528,.534)),exit=smooth(progress(p,.544,.549)),t=progress(p,.532,.544),wind=still?0:v.x*v.presence;
 const width=Math.min(w*(mobile?.76:.37),h*.57),height=width*.6;
 c.save();c.translate(w*(mobile?.57:.75),h*.70+(1-entrance+exit)*(h+height));c.rotate(-.08+wind*.07);c.transform(1,.025,wind*.07,1,0,0);
 c.shadowColor='#160b0799';c.shadowBlur=20;c.shadowOffsetY=10;c.fillStyle='#e7d6b7';c.fillRect(-width/2,-height/2,width,height);c.shadowColor='transparent';
 c.strokeStyle='#7e756039';c.lineWidth=.7;
 for(let j=0;j<8;j++){c.beginPath();for(let i=0;i<=24;i++){const x=-width*.46+i/24*width*.69,y=-height*.4+j*height*.1+Math.sin(i*.37+j)*height*.035;i?c.lineTo(x,y):c.moveTo(x,y)}c.stroke()}
 c.strokeStyle='#8c745a66';c.beginPath();c.moveTo(width*.22,-height*.4);c.lineTo(width*.22,height*.4);c.stroke();
 for(let i=0;i<4;i++){c.beginPath();c.moveTo(width*.27,height*(-.05+i*.1));c.lineTo(width*.44,height*(-.05+i*.1));c.stroke()}
 c.fillStyle='#ad5442';c.fillRect(width*.32,-height*.39,width*.1,height*.19);c.strokeStyle='#f1ddbd';c.lineWidth=1;c.strokeRect(width*.33,-height*.37,width*.08,height*.15);
 c.strokeStyle='#a32e32';c.lineWidth=1.8;c.lineCap='round';c.beginPath();let tip;
 for(let i=0;i<=Math.floor(smooth(t)*80);i++){const u=i/80,x=width*(-.4+u*.55),y=height*(.16-Math.sin(u*5.5)*.18)+wind*Math.sin(u*Math.PI)*height*.06;i?c.lineTo(x,y):c.moveTo(x,y);tip=[x,y]}c.stroke();
 if(tip){c.fillStyle='#a32e32';c.beginPath();c.arc(...tip,3,0,Math.PI*2);c.fill();}
 const stamp=smooth(progress(t,.65,.9));c.save();c.globalAlpha=stamp;c.strokeStyle='#524136';c.lineWidth=.7;c.beginPath();c.ellipse(width*.32,-height*.23,width*.105,height*.16,-.2,0,Math.PI*2);c.stroke();for(let i=0;i<3;i++){c.beginPath();c.moveTo(width*.23,-height*.26+i*4);c.bezierCurveTo(width*.31,-height*.33+i*4,width*.41,-height*.19+i*4,width*.48,-height*.26+i*4);c.stroke()}c.restore();
 const curl=width*(.035+(still?0:v.presence*.02));c.fillStyle='#b49c77';c.beginPath();c.moveTo(width/2,height/2-curl);c.lineTo(width/2-curl,height/2);c.lineTo(width/2-curl*.8,height/2-curl*.8);c.closePath();c.fill();c.restore();
}
