import {progress,smooth} from './timeline.mjs';
const gate=(p,a,b,c,d)=>smooth(progress(p,a,b))*(1-smooth(progress(p,c,d)));
/** A receipt unfurls among the memories; refracted sunlight follows the final glass. */
export function drawKeepsakes(ctx,{p,w,h,mobile,still,visitor:v}){
 const a=gate(p,.253,.271,.295,.307);
 if(a){
 const compact=h<600&&w>h,rw=Math.min(mobile?110:145,w*.29),rh=Math.min(rw*1.62,compact?h*.25:h*.25),x=w*(mobile?.20:.55),y=h*(compact?.71:.75),unroll=still?1:smooth(progress(p,.253,.279));
 ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.rotate(-.13+(still?0:v.x*.10));ctx.translate(0,still?0:-v.presence*7);ctx.shadowColor='#120b0977';ctx.shadowBlur=14;ctx.shadowOffsetY=7;
 const top=-rh/2,bottom=top+rh*unroll;ctx.beginPath();ctx.moveTo(-rw/2,top);ctx.lineTo(rw/2,top);ctx.lineTo(rw/2,bottom);for(let i=0;i<=12;i++)ctx.lineTo(rw/2-i*rw/12,bottom+(i%2?3:0));ctx.closePath();ctx.fillStyle='#dfd0af';ctx.fill();ctx.shadowColor='transparent';ctx.clip();
 const shade=ctx.createLinearGradient(-rw/2,0,rw/2,0);shade.addColorStop(0,'#5a3b1c15');shade.addColorStop(.5,'#fff8df55');shade.addColorStop(1,'#69492b25');ctx.fillStyle=shade;ctx.fillRect(-rw/2,top,rw,rh);
 ctx.fillStyle='#735843';ctx.textAlign='center';ctx.font=`${Math.max(10,rw*.08)}px Manrope,sans-serif`;ctx.fillText('ONE MORE',0,top+rh*.2,rw*.86);ctx.fillRect(-rw*.33,top+rh*.28,rw*.66,.6);ctx.font=`italic ${Math.max(12,rw*.12)}px Bodoni,serif`;ctx.fillText('two coffees',0,top+rh*.45,rw*.88);ctx.fillText('one evening',0,top+rh*.63,rw*.88);ctx.font=`${Math.max(9,rw*.07)}px Manrope,sans-serif`;ctx.fillText('kept, anyway.',0,top+rh*.83,rw*.88);
 if(!still&&unroll<1){const curl=ctx.createLinearGradient(0,bottom-15,0,bottom);curl.addColorStop(0,'#fff3d4');curl.addColorStop(.6,'#a08562');curl.addColorStop(1,'#695037');ctx.fillStyle=curl;ctx.fillRect(-rw/2,bottom-15,rw,15)}ctx.restore();
 }
 if(p>.974&&!still){const alpha=smooth(progress(p,.974,.995));ctx.save();ctx.globalCompositeOperation='screen';ctx.translate(w*(.85+v.x*.04),h*.52);ctx.rotate(-.48+v.x*.04);
 for(let i=0;i<3;i++){const light=ctx.createLinearGradient(-w*.5,i*12,w*.4,i*12);light.addColorStop(0,'transparent');light.addColorStop(.4,`rgba(255,210,143,${alpha*.075})`);light.addColorStop(.65,`rgba(255,234,185,${alpha*.12})`);light.addColorStop(1,'transparent');ctx.fillStyle=light;ctx.fillRect(-w*.5,i*12,w*.9,4+i*2)}ctx.restore()}
}
