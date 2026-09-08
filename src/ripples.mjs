/** Touch/hover rings on the rain glass; passive input preserves native scrolling. */
export function ripples({state,wake,signal}){
 let rings=[],last=0,inside=false;
 function add(x,y){rings.push({x,y,at:performance.now()});if(rings.length>8)rings.shift();wake()}
 window.addEventListener('pointermove',e=>{const {p,w,h,still}=state();if(still||p<.345||p>.407||e.target.closest('button,a')||performance.now()-last<170)return;if(e.clientX>w*.48&&e.clientY<h*.65){add(e.clientX/w,e.clientY/h);last=performance.now()}},{passive:true,signal});
 window.addEventListener('pointerdown',e=>{const {p,w,h}=state();if(p>.345&&p<.407&&!e.target.closest('button,a'))add(e.clientX/w,e.clientY/h)},{passive:true,signal});
 return {get moving(){return rings.length>0&&!state().still},draw(ctx){const {p,w,h,still}=state(),active=p>.345&&p<.407;if(!active){rings=[];inside=false;return}if(!inside){inside=true;if(!still)rings=[{x:.76,y:.25,at:performance.now()},{x:.88,y:.42,at:performance.now()+250}]}
 const now=performance.now();rings=rings.filter(r=>now-r.at<1600);ctx.save();for(const r of rings){const t=still?.35:(now-r.at)/1600;if(t<0)continue;ctx.strokeStyle=`rgba(220,239,234,${(1-t)*.30})`;ctx.lineWidth=.8;for(let i=0;i<2;i++){const radius=(8+t*50)*(i?1:.64);ctx.beginPath();ctx.ellipse(r.x*w,r.y*h,radius,radius*.65,0,0,Math.PI*2);ctx.stroke()}}ctx.restore()}};
}
