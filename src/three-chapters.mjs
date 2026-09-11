import {progress,smooth,cover} from './timeline.mjs';
export const newChapters=[
 {id:'margins',name:'In the margins',at:.457,range:[.444,.450,.463,.470],scroll:[.444,.470,200],title:'Even there.<br><em>Your name.</em>',caption:'You wrote around what you meant.'},
 {id:'familiar',name:'The familiar',at:.905,range:[.896,.901,.911,.916],scroll:[.896,.916,200],title:'A thousand<br><em>small returns.</em>',caption:'Ordinary places. Always you.'},
 {id:'spare',name:'The spare cup',at:.957,range:[.948,.952,.960,.965],scroll:[.948,.965,200],title:'There is<br><em>still room.</em>',caption:'You never stopped setting a place.'},
];
export function drawNewChapters(c,{p,w,h,mobile,still,visitor:v,plates}){
 const wind=still?0:v.x*v.presence;
 for(const b of newChapters){const [a,inEnd,outStart,end]=b.range,gate=smooth(progress(p,a,inEnd))*(1-smooth(progress(p,outStart,end)));if(!gate)continue;
 const t=still?1:progress(p,inEnd,outStart);
 c.save();
 if(b.id==='margins'){
  const width=Math.min(w*(mobile?.75:.33),h*.55),height=width*.55;
  c.translate(w*(mobile?.57:.76),h*.72+(1-gate)*(h+height));c.rotate(-.07+wind*.05);
  c.shadowColor='#160e0799';c.shadowBlur=18;c.shadowOffsetY=9;c.fillStyle='#e7d5b7';c.fillRect(-width/2,-height/2,width,height);c.shadowColor='transparent';
  c.strokeStyle='#ab957433';c.lineWidth=.5;for(let i=0;i<35;i++){const y=-height/2+(i*.618%1)*height;c.beginPath();c.moveTo(-width/2,y);c.lineTo(width/2,y+.7);c.stroke()}
  c.strokeStyle='#af595a77';c.beginPath();c.moveTo(-width*.34,-height*.42);c.lineTo(-width*.34,height*.42);c.stroke();
  for(const [i,line] of ['Somewhere between','the ordinary things,','there you were.'].entries()){
   c.save();c.beginPath();c.rect(-width*.28,-height*.36+i*height*.23,width*.76*smooth(progress(t,i*.22,i*.22+.34)),height*.26);c.clip();c.fillStyle='#584536';c.font=`italic ${width*.077}px Bodoni,serif`;c.fillText(line,-width*.27,-height*.16+i*height*.23);c.restore();
  }
  const curl=width*.08*smooth(t);c.fillStyle='#c4ad89';c.beginPath();c.moveTo(width/2,height/2);c.lineTo(width/2-curl,height/2);c.quadraticCurveTo(width/2-curl*.4,height/2-curl*.4,width/2,height/2-curl);c.closePath();c.fill();
 }else if(b.id==='familiar'){
  const width=Math.min(w*(mobile?.88:.46),h*.83),height=width*.35;
  c.translate(w*(mobile?.51:.71),h*.74+(1-gate)*(h+height));c.rotate(.06+wind*.055);
  c.shadowColor='#08060599';c.shadowBlur=20;c.shadowOffsetY=10;c.fillStyle='#d4bea0';c.fillRect(-width/2,-height/2,width,height);c.shadowColor='transparent';
  ['hero-cafe','us-street','unsent'].forEach((name,i)=>{
   const image=plates.get(name),x=-width*.47+i*width*.32,y=-height*.42,cw=width*.30,ch=height*.72;
   c.fillStyle='#302822';c.fillRect(x,y,cw,ch);
   if(image){const rect=cover(image.width,image.height,cw,ch);c.save();c.beginPath();c.rect(x,y,cw,ch);c.clip();c.drawImage(image,x+rect.x,y+rect.y,rect.w,rect.h);c.fillStyle='#302822';c.globalAlpha=still?0:1-smooth(progress(t,i*.22,i*.22+.42));c.fillRect(x,y,cw,ch);c.restore()}
   c.fillStyle='#675543';c.font=`${Math.max(9,width*.018)}px Manrope,sans-serif`;c.fillText(['01 / the chair','02 / the walk','03 / the words'][i],x,height*.41);
  });
 }else{
  c.globalAlpha=gate*.28;c.globalCompositeOperation='screen';
  for(let i=0;i<6;i++){const x=w*(.65+i*.055)+wind*w*.025,y=h*(.74+Math.sin(t*4+i)*.035),r=8+smooth(t)*24;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'#ffe7b4');g.addColorStop(1,'#ffe7b400');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}
 }
 c.restore();
 }
}
