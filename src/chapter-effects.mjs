import {expansionBeats} from './expansion.mjs';
import {progress,smooth,mix,cover} from './timeline.mjs';
const gate=(p,a,b,c,d)=>smooth(progress(p,a,b))*(1-smooth(progress(p,c,d)));
const seeds=Array.from({length:48},(_,i)=>({a:i*2.399963,s:((i*47)%53)/53,z:((i*31)%47)/47}));
const typeRanges=[...expansionBeats.map(b=>['#'+b.id+'-copy h2',b.range[0],b.range[1]]),['#address-copy h2',.530,.535],['#opening .love',0,.015],['#notice-copy h2',.13,.16],['#little-copy h2',.244,.263],['#unsent-copy h2',.470,.480],['#us-copy h2',.55,.569],['#trying-copy h2',.755,.775],['#impossible-copy h2',.83,.85],['#love-copy h2',.997,1],['#stay-copy h2',.965,.974],['#hours-copy h2',.205,.216],['#detour-copy h2',.614,.625],['#light-copy h2',.917,.93],['#pressed-copy h2',.285,.294],['#blue-copy h2',.390,.402],['#space-copy h2',.720,.731],['#unsaid-copy h2',.514,.524],['#kept-copy h2',.782,.788]];
function splitHeading(el){
 const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){const fragment=document.createDocumentFragment();for(const word of node.textContent.split(/(\s+)/)){if(!word)continue;if(/^\s+$/.test(word)){fragment.append(document.createTextNode(word));continue}const span=document.createElement('span');span.className='kinetic-word';span.textContent=word;fragment.append(span)}node.replaceWith(fragment)}return [...el.querySelectorAll('.kinetic-word')];
}
let beam;
function sunlight(){if(beam)return beam;beam=document.createElement('canvas');beam.width=96;beam.height=256;const c=beam.getContext('2d'),x=c.createLinearGradient(0,0,96,0);x.addColorStop(0,'transparent');x.addColorStop(.5,'#ffdfaa');x.addColorStop(1,'transparent');c.fillStyle=x;c.fillRect(0,0,96,256);c.globalCompositeOperation='destination-in';const y=c.createLinearGradient(0,0,0,256);y.addColorStop(0,'#fff');y.addColorStop(.55,'#ffffff88');y.addColorStop(1,'transparent');c.fillStyle=y;c.fillRect(0,0,96,256);return beam;}
export function chapterEffects({state,wake,signal}){
 const type=typeRanges.map(([selector,a,b])=>({words:splitHeading(document.querySelector(selector)),a,b}));let trail=[],lastTouch=0;
 window.addEventListener('pointermove',e=>{const s=state();if(s.still||!document.querySelector('#chapters').hidden||e.target.closest('a,button,.reading'))return;const last=trail.at(-1);if(last&&Math.hypot(last.x-e.clientX,last.y-e.clientY)<8)return;trail.push({x:e.clientX,y:e.clientY,time:performance.now()});trail=trail.slice(-18);lastTouch=performance.now();wake()},{passive:true,signal});
 return {get moving(){return !state().still&&performance.now()-lastTouch<850&&trail.length>1},draw(c){
 const s=state(),{p,w,h,mobile,still,visitor:v,plates}=s;const wind=still?0:v.x*v.presence;
 for(const {words,a,b} of type)words.forEach((word,i)=>{const t=still?1:smooth(progress(p,a+(b-a)*.17*i/words.length,b));word.style.transform=`perspective(700px) translate3d(${wind*(i%2?2:-2)*t}px,0px,0) rotateX(${(1-t)*60}deg)`;word.style.opacity=String(t);});
 if(still)return;
 // An oversized clock: its hands wind through the evening and resolve into one hour.
 let alpha=gate(p,.197,.210,.223,.230);
 if(alpha){const t=progress(p,.197,.23),r=Math.min(w*(mobile?.32:.17),h*.19),x=w*(mobile?.70:.79),y=h*(mobile?.72:.57);c.save();c.translate(x,y);c.rotate(wind*.08);c.globalAlpha=alpha*.72;
 const glow=c.createRadialGradient(0,0,r*.4,0,0,r*1.6);glow.addColorStop(0,'#edc08518');glow.addColorStop(1,'transparent');c.fillStyle=glow;c.fillRect(-r*1.6,-r*1.6,r*3.2,r*3.2);
 c.strokeStyle='#d9bc88';c.lineWidth=1;c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.stroke();c.beginPath();c.arc(0,0,r*.91,-Math.PI/2,-Math.PI/2+Math.PI*2*smooth(t));c.stroke();
 for(let i=0;i<60;i++){const a=i*Math.PI/30;c.beginPath();c.moveTo(Math.sin(a)*r,Math.cos(a)*r);c.lineTo(Math.sin(a)*r*(i%5?.97:.9),Math.cos(a)*r*(i%5?.97:.9));c.globalAlpha=alpha*(i%5?.25:.8);c.stroke()}
 for(const [length,angle,width] of [[.73,t*Math.PI*5,1],[.45,t*Math.PI*.6,2]]){c.save();c.rotate(angle);c.lineWidth=width;c.globalAlpha=alpha*.85;c.beginPath();c.moveTo(0,r*.1);c.lineTo(0,-r*length);c.stroke();c.restore()}
 c.save();c.rotate(t*Math.PI*12);c.strokeStyle='#bf5948';c.lineWidth=.8;c.globalAlpha=alpha*.8;c.beginPath();c.moveTo(0,r*.18);c.lineTo(0,-r*.83);c.stroke();c.restore();
 c.fillStyle='#e3caa0';c.beginPath();c.arc(0,0,3,0,Math.PI*2);c.fill();c.restore();}
 // A street plan builds itself beneath the detour, and a moving red route finds its way home.
 alpha=gate(p,.610,.621,.641,.650);
 if(alpha){const t=progress(p,.610,.650);c.save();c.translate(w*.5,h*.72);c.transform(1,-.08+wind*.04,.45+wind*.1,.58,0,0);const unit=Math.min(w*.16,100);c.strokeStyle='#d6c3a3';c.lineWidth=.65;c.globalAlpha=alpha*.18;
 for(let i=-5;i<=5;i++){c.beginPath();c.moveTo(-w*.7,i*unit);c.lineTo(w*.7,i*unit);c.moveTo(i*unit,-h*.25);c.lineTo(i*unit,h*.28);c.stroke();}
 c.globalAlpha=alpha*.75;c.strokeStyle='#d85443';c.lineWidth=2.3;c.lineCap='round';c.beginPath();let tip;
 for(let i=0;i<=Math.floor(100*smooth(t));i++){const u=i/100,x=mix(-w*.48,w*.43,u),y=Math.sin(u*6.28)*unit*.8+Math.sin(u*13)*unit*.15;i?c.lineTo(x,y):c.moveTo(x,y);tip=[x,y]}c.stroke();
 if(tip){c.fillStyle='#ffdec0';c.beginPath();c.arc(...tip,4,0,Math.PI*2);c.fill();c.strokeStyle='#f2ac7855';c.beginPath();c.arc(...tip,11,0,Math.PI*2);c.stroke();}
 c.restore();}
 // Physical photographs orbit through a shallow 3D memory gallery, never becoming the film background.
 alpha=gate(p,.825,.839,.865,.878);
 if(alpha){const t=progress(p,.825,.878),names=['hero-cafe','us-street','unsent'];c.save();
 for(let i=0;i<(mobile?5:9);i++){const image=plates.get(names[i%3]);if(!image)continue;const a=seeds[i].a+t*2.1,depth=(Math.sin(a)+1)/2,side=i%2?1:-1,size=Math.min(w*.30,260)*(.4+depth*.8),x=w*(side>0?.90:.10)+Math.cos(a)*w*.09+wind*w*.05*depth,y=h*(.40+seeds[i].s*.48)+Math.sin(a)*h*.05;
 c.save();c.globalAlpha=alpha*(.35+depth*.5);c.translate(x,y);c.rotate(Math.sin(a)*.25);c.scale(.35+Math.abs(Math.cos(a))*.65,1);c.shadowColor='#080a0bcc';c.shadowBlur=18*depth;c.shadowOffsetY=8*depth;c.fillStyle='#e9ddc8';c.fillRect(-size/2-4,-size*.32-4,size+8,size*.64+16);c.shadowColor='transparent';const b=cover(image.width,image.height,size,size*.64);c.save();c.beginPath();c.rect(-size/2,-size*.32,size,size*.64);c.clip();c.drawImage(image,b.x-size/2,b.y-size*.32,b.w,b.h);c.restore();c.restore();}c.restore();}
 // Window caustics open out with the last film, with a subtle prismatic rim.
 alpha=gate(p,.916,.929,.950,.967);
 if(alpha){const t=progress(p,.916,.967);c.save();c.globalCompositeOperation='screen';c.translate(w*(.88+wind*.045),h*.17);c.rotate(.35+wind*.1);c.transform(1,0,.14,1,0,0);c.globalAlpha=alpha*.11;for(let i=0;i<5;i++){const spread=w*(.018+t*.065);c.drawImage(sunlight(),i*spread-spread*.5,0,spread*2,h)}c.restore();}
 // A living signature of the visitor's path: short-lived, bounded, and purely decorative.
 const now=performance.now();trail=trail.filter(a=>now-a.time<850);
 if(trail.length>1&&p>.15){c.save();c.lineCap='round';for(let i=1;i<trail.length;i++){const a=trail[i-1],b=trail[i],life=1-(now-b.time)/850;c.globalAlpha=life*.4;c.strokeStyle=p>.95?'#ddaf69':'#d77862';c.lineWidth=life*1.7;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();}c.restore();}
 }};
}
