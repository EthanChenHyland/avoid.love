import {clamp,progress,smooth,mix,cover,firstAct} from './timeline.mjs';
import {FrameSequence} from './sequence.mjs';
const $=s=>document.querySelector(s);
const canvas=$('#world'),ctx=canvas.getContext('2d',{alpha:false});
const narrow=matchMedia('(max-width:700px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
let still=reduced.matches,mobile=narrow.matches,w=innerWidth,h=innerHeight,dpr=1,p=0,target=0,raf=0,last=0,dirty=true;
let plates={},sequence=null,manifest=null,errors=[],samples=[];
const opening=$('#opening'),foot=$('#opening-foot'),foreground=$('#foreground'),notice=$('#notice-copy'),late=$('#late-copy');
function invalidate(){dirty=true;if(!raf&&!document.hidden)raf=requestAnimationFrame(tick)}
async function loadPlate(name){const img=new Image();img.src=`/art/${name}${mobile?'-mobile':''}.webp`;await img.decode();return img}
async function load(){
 const pairs=await Promise.allSettled(['hero-poppy','hero-cafe'].map(async n=>[n,await loadPlate(n)]));
 for(const r of pairs){if(r.status==='fulfilled')plates[r.value[0]]=r.value[1];else errors.push('Poster failed')}
 invalidate();
 try{const r=await fetch('/film-manifest.json');if(!r.ok)return;manifest=await r.json();setupSequence()}catch{}
}
function setupSequence(){sequence?.dispose();sequence=null;if(!still&&manifest){const film=manifest.transition;sequence=new FrameSequence({base:mobile?film.mobile:film.desktop,count:film.count,limit:mobile?12:24,onReady:invalidate});sequence.request(0)}invalidate()}
function resize(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,mobile?1.25:1.75);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);updateTarget();invalidate()}
function draw(image,scale=1,alpha=1,focus=.5){if(!image)return;const b=cover(image.width,image.height,w,h,focus,scale);ctx.globalAlpha=alpha;ctx.drawImage(image,b.x,b.y,b.w,b.h);ctx.globalAlpha=1}
function render(){
 const a=firstAct(p);const hero=plates['hero-poppy'],cafe=plates['hero-cafe'];
 ctx.fillStyle='#172629';ctx.fillRect(0,0,w,h);
 if(still){draw(hero);draw(cafe,smooth(progress(p,.42,.58))?1:1,smooth(progress(p,.42,.58)));}
 else{
  const zoom=1+smooth(progress(p,.05,.29))*.065;
  draw(hero,zoom);
  if(p>.29&&p<.83&&sequence){const frame=sequence.get(a.film);if(frame)draw(frame,1,Math.min(progress(p,.29,.32),1-progress(p,.79,.83)),mobile?.76:.5);else draw(cafe,1.03,smooth(progress(p,.4,.72)));}
  else if(p>=.29)draw(cafe,1.03,smooth(progress(p,.4,.72)));
  if(p>.74)draw(cafe,mix(1.03,1,smooth(a.hold)),smooth(progress(p,.74,.81)));
 }
 const heroOpacity=still?1-smooth(progress(p,.36,.46)):a.hero;
 opening.style.opacity=heroOpacity;foot.style.opacity=heroOpacity;
 opening.style.transform=`translateY(${still?0:-progress(p,.03,.3)*40}px) scale(${still?1:1+progress(p,.02,.3)*.025})`;
 foreground.style.opacity=heroOpacity;foreground.style.transform=`scale(${still?1:1+smooth(progress(p,.05,.29))*.065})`;
 $('#bridge-copy').style.opacity=still?0:smooth(progress(p,.43,.47))*(1-smooth(progress(p,.54,.59)));
 const cafeOpacity=still?smooth(progress(p,.55,.62)):a.cafe;
 notice.style.opacity=cafeOpacity*(1-smooth(progress(p,.91,.98)));
 notice.style.transform=`translateX(${still?0:(1-cafeOpacity)*-35}px)`;
 late.style.opacity=smooth(progress(p,.92,.99));
 $('#chapter-label').textContent=p<.5?'Before':'The other chair';
 $('#next-beat').innerHTML=p>.91?'Once more <span aria-hidden="true">↺</span>':p>.4?'Stay a little longer <span aria-hidden="true">↓</span>':'Scroll a little closer <span aria-hidden="true">↓</span>';
 $('#progress-fill').style.transform=`scaleX(${p})`;
 canvas.dataset.progress=p.toFixed(4);canvas.dataset.frame=sequence?.drawn??-1;canvas.dataset.cached=sequence?.frames.size??0;
}
function tick(time){raf=0;if(document.hidden)return;const dt=last?Math.min(time-last,50):16;last=time;
 if(!still)p+=(target-p)*(1-Math.exp(-dt/90));else p=target;
 if(Math.abs(target-p)<.00005)p=target;
 const start=performance.now();if(dirty||p!==target){render();dirty=false;samples.push(performance.now()-start);if(samples.length>180)samples.shift()}
 if(p!==target)invalidate();else last=0;
}
function updateTarget(){target=clamp(scrollY/Math.max(1,$('.scroll-track').offsetHeight-innerHeight));invalidate()}
function jump(value){window.scrollTo({top:value*Math.max(1,$('.scroll-track').offsetHeight-innerHeight),behavior:still?'instant':'smooth'})}
addEventListener('scroll',updateTarget,{passive:true});addEventListener('resize',resize,{passive:true});
narrow.addEventListener('change',()=>{mobile=narrow.matches;load();resize()});
reduced.addEventListener('change',()=>{still=reduced.matches;$('#still-toggle').setAttribute('aria-pressed',String(still));setupSequence();updateTarget()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)invalidate();else if(raf){cancelAnimationFrame(raf);raf=0}});
addEventListener('pagehide',()=>sequence?.dispose());addEventListener('pageshow',e=>{if(e.persisted)setupSequence()});
const nav=$('#chapters'),toggle=$('#chapters-toggle');function menu(open){nav.hidden=!open;toggle.setAttribute('aria-expanded',String(open));if(open)$('#chapters-close').focus();else toggle.focus()}
toggle.addEventListener('click',()=>menu(nav.hidden));$('#chapters-close').addEventListener('click',()=>menu(false));
nav.addEventListener('keydown',e=>{if(e.key==='Escape')menu(false);if(e.key==='Tab'){const items=[...nav.querySelectorAll('a,button')];if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();items.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===items.at(-1)){e.preventDefault();items[0].focus()}}});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();menu(false);jump(a.hash==='#before'?0:.86)}));
$('#still-toggle').setAttribute('aria-pressed',String(still));$('#still-toggle').addEventListener('click',()=>{still=!still;$('#still-toggle').setAttribute('aria-pressed',String(still));setupSequence();updateTarget()});
$('#next-beat').addEventListener('click',()=>jump(p>.91?0:p>.4?1:.34));
addEventListener('hashchange',()=>document.body.classList.toggle('reading-active',location.hash==='#reading'));
resize();load();
