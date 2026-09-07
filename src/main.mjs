import {clamp,progress,smooth,mix,cover,firstAct} from './timeline.mjs';
import {FrameSequence} from './sequence.mjs';
import {chapters,chapterIndex} from './story.mjs';
import {memories} from './memory.mjs';
import {Visitor,depthAmount,gradeCopy,letterLight,redThread} from './interaction.mjs';
const visitor=new Visitor();
const $=s=>document.querySelector(s),canvas=$('#world'),ctx=canvas.getContext('2d',{alpha:false});
const wipeCanvas=document.createElement('canvas'),wipeCtx=wipeCanvas.getContext('2d');
const narrow=matchMedia('(max-width:700px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
let still=reduced.matches,mobile=narrow.matches,w=innerWidth,h=innerHeight,dpr=1,p=0,target=0,raf=0,last=0,dirty=true,holding=false,held=0,active=0,manifest=null,loadVersion=0;
const plates=new Map(),plateLoads=new Map(),sequences=new Map(),errors=new Set(),abort=new AbortController();
const shots=['opening','opening-foot','notice-copy','late-copy','bridge-copy','little-copy','waiting-copy','unsent-copy','us-copy','distance-copy','trying-copy','impossible-copy','love-copy'].map(id=>$('#'+id));
const nav=$('#chapters'),toggle=$('#chapters-toggle'),holdButton=$('#hold-memory');
let openingTravel=0,layoutReady=false;
let filmBlending=false,mistSource=null;
const memory=memories({state:()=>({p,w,h,mobile,still}),wake:invalidate,signal:abort.signal});
let samples=[],frameStats={frame:-1,cached:0,film:''};
function invalidate(){dirty=true;if(!raf&&!document.hidden)raf=requestAnimationFrame(tick)}
async function plate(name){
 if(plates.has(name))return plates.get(name);if(plateLoads.has(name))return plateLoads.get(name);
 const version=loadVersion;
 const promise=(async()=>{const img=new Image();img.src=`/art/${name}${mobile?'-mobile':''}.webp`;await img.decode();if(version===loadVersion){plates.set(name,img);invalidate()}return img})().catch(()=>{errors.add(name);return null}).finally(()=>{if(plateLoads.get(name)===promise)plateLoads.delete(name)});
 plateLoads.set(name,promise);return promise;
}
function prepareNearby(){
 const names=new Set([chapters[active]?.art,chapters[Math.min(9,active+1)]?.art,chapters[Math.max(0,active-1)]?.art]);
 if(active===6||active===7)names.add('hero-cafe');
 if(active===5){names.add('us-street');names.add('hero-cafe')}
 if(active===8){names.add('us-street');names.add('hero-cafe');names.add('unsent')}
 if(active===2)names.add('little-things-depth');if(active===9)names.add('love-morning-depth');
 for(const name of names)if(name)plate(name);
 // Retain only the nearby chapter plates, plus the instant first-frame fallback.
 for(const name of plates.keys())if(!names.has(name)&&name!=='hero-poppy')plates.delete(name);
}
function setupMotion(){for(const seq of sequences.values())seq.dispose();sequences.clear();document.documentElement.dataset.still=String(still);$('#still-toggle').setAttribute('aria-pressed',String(still));resize()}
function film(name,t,fallback){
 if(still||!manifest?.[name]||(mobile&&['opening','waiting','distance'].includes(name)))return fallback;
 let seq=sequences.get(name);if(!seq){const m=manifest[name];seq=new FrameSequence({base:mobile?m.mobile:m.desktop,count:m.count,limit:mobile?12:24,onReady:invalidate});sequences.set(name,seq)}
 if(sequences.size>2){const old=[...sequences.keys()].find(k=>k!==name);sequences.get(old).dispose();sequences.delete(old)}
 const image=seq.get(t);if(image&&!seq.readyAt)seq.readyAt=performance.now();const blend=image?smooth(clamp((performance.now()-seq.readyAt)/220)):0;if(image&&blend<1)filmBlending=true;frameStats={film:name,frame:seq.drawn,cached:[...sequences.values()].reduce((n,s)=>n+s.frames.size,0)};return image?{filmImage:image,fallback,blend}:fallback;
}
function draw(image,scale=1,alpha=1,focus=.5,dx=0,dy=0,dc=ctx){if(!image||alpha<=0)return;if(image.filmImage){if(image.blend<1)draw(image.fallback,scale,alpha,focus,dx,dy,dc);draw(image.filmImage,scale,alpha*image.blend,focus,dx,dy,dc);return}const b=cover(image.width,image.height,w,h,focus,scale);dc.globalAlpha=clamp(alpha);dc.drawImage(image,b.x+dx,b.y+dy,b.w,b.h);dc.globalAlpha=1}
function depthPlate(name,scale=1,alpha=1){
 const amount=still?0:depthAmount(p),gain=mobile?.5:1;
 draw(plates.get(name),scale+amount*.012,alpha,.5,visitor.x*amount*2*gain,visitor.y*amount*1.5*gain);
 if(amount&&plates.has(name+'-depth'))draw(plates.get(name+'-depth'),scale+amount*.012,alpha*amount,.5,visitor.x*amount*7*gain,visitor.y*amount*5*gain);
}
function wipe(image,t,kind='diagonal',scale=1,focus=.5){
 if(!image||t<=0)return;if(t>=1){draw(image,scale,1,focus);return}if(still){draw(image,scale,smooth(t),focus);return}
 // A feathered optical edge, with endpoints entirely outside the viewport.
 const f=w*.035,k=smooth(t);wipeCtx.clearRect(0,0,w,h);draw(image,scale,1,focus,0,0,wipeCtx);wipeCtx.save();wipeCtx.globalCompositeOperation='destination-in';let mask;
 if(kind==='iris'){const radius=Math.hypot(w,h)*k;mask=wipeCtx.createRadialGradient(w*.7,h*.65,Math.max(0,radius-f),w*.7,h*.65,radius+f);mask.addColorStop(0,'#000');mask.addColorStop(1,'transparent')}
 else{const edge=mix(kind==='diagonal'?2*w+f:w+f,-f,k);mask=wipeCtx.createLinearGradient(edge-f,0,edge+f,0);mask.addColorStop(0,'transparent');mask.addColorStop(1,'#000');if(kind==='diagonal')wipeCtx.transform(1,0,-w/h,1,0,0)}
 wipeCtx.fillStyle=mask;wipeCtx.fillRect(-w,0,w*3,h);wipeCtx.restore();ctx.drawImage(wipeCanvas,0,0,w,h);
}
// Exclusive copy intervals keep outgoing and incoming headlines from sharing the lens.
const copyRanges={'notice-copy':[.13,.226],'late-copy':[.226,.242],'little-copy':[.244,.318],'waiting-copy':[.32,.43],'unsent-copy':[.432,.548],'us-copy':[.55,.659],'distance-copy':[.661,.753],'trying-copy':[.755,.828],'impossible-copy':[.83,.948],'love-copy':[.95,1.02]};
const show=(id,opacity)=>{const bounds=copyRanges[id];const gate=bounds?smooth(progress(p,bounds[0],bounds[0]+.003))*(1-smooth(progress(p,bounds[1]-.003,bounds[1]))):1;$('#'+id).style.opacity=clamp(opacity*gate);};
const windowed=(x,a,b,c,d)=>smooth(progress(x,a,b))*(1-smooth(progress(x,c,d)));
function photo(image,t,x=.5,y=.5,angle=0){if(!image)return;const q=smooth(t),cw=mix(w*.18,w*1.15,q),ch=cw*image.height/image.width;ctx.save();ctx.translate(mix(w*x,w*.5,q),mix(h*y,h*.5,q));ctx.rotate(angle*(1-q));ctx.globalAlpha=smooth(progress(t,0,.13))*(1-smooth(progress(t,.86,1)));ctx.fillStyle='#eee3d1';ctx.fillRect(-cw/2-6,-ch/2-6,cw+12,ch+12);ctx.drawImage(image,-cw/2,-ch/2,cw,ch);ctx.restore();ctx.globalAlpha=1}
function render(){
 const started=performance.now();filmBlending=false;mistSource=null;canvas.style.opacity=plates.size?'1':'0';for(const el of shots)el.style.opacity=0;$('#foreground').style.opacity=0;ctx.fillStyle='#101b1d';ctx.fillRect(0,0,w,h);frameStats={frame:-1,cached:0,film:''};
 const get=n=>plates.get(n),hero=get('hero-poppy'),cafe=get('hero-cafe'),q=p/.23;
 if(p<.255){
  const a=firstAct(q),zoom=still?1:1+smooth(progress(q,.05,.29))*.065;
  draw(hero,zoom);
  if(!still&&q>.035&&q<.35){const opening=film('opening',progress(q,.035,.29),hero);draw(opening,1,smooth(progress(q,.035,.065)),mobile?.77:.5)}
  if(still)draw(cafe,1,smooth(progress(q,.42,.58)));
  else if(q>.29&&q<.86){const frame=film('transition',a.film,hero);draw(frame,1,smooth(progress(q,.29,.35)),mobile?.77:.5)}
  if(q>=.76)draw(cafe,1,smooth(progress(q,.76,.85)));
  const op=still?1-smooth(progress(q,.36,.46)):a.hero;show('opening',op);show('opening-foot',op);
  $('#opening').style.transform=`translateY(${still?0:-progress(q,.03,.3)*openingTravel}px) scale(${still?1:1+progress(q,.02,.3)*.025})`;
  $('#foreground').style.opacity=still?0:op*(1-smooth(progress(q,.025,.065)));$('#foreground').style.transform=`scale(${zoom})`;
  show('bridge-copy',still?0:windowed(q,.43,.47,.54,.59));
  show('notice-copy',(still?smooth(progress(q,.55,.62)):a.cafe)*(1-smooth(progress(q,.91,.98))));
  show('late-copy',smooth(progress(q,.92,.99))*(1-smooth(progress(p,.225,.25))));
 }
 if(p>=.23&&p<.335){const local=progress(p,.23,.31);if(p<.255){draw(cafe);wipe(get('little-things'),progress(p,.23,.255),'diagonal',still?1:1+local*.09)}else depthPlate('little-things',still?1:1+local*.09);
  show('little-copy',windowed(p,.24,.26,.298,.32));$('#little-copy').style.transform=`translateY(${still?0:-local*20}px)`;
 }
 if(p>=.31&&p<.44){const local=progress(p,.31,.42),rain=film('waiting',local,get('waiting'));mistSource=rain;if(p<.335){wipe(rain,progress(p,.31,.335),'window',1,mobile?.77:.5)}else draw(rain,1,1,mobile?.77:.5);
  show('waiting-copy',windowed(p,.32,.34,.409,.435));$('#clock-time').textContent='1:'+String(13+Math.floor(local*4)).padStart(2,'0');$('.waiting-line').textContent=local>.63?'Still nothing.':'Nothing yet.';
 }
 if(p>=.42&&p<.56){const local=progress(p,.42,.54),letter=film('unsent',mix(local,.05,smooth(held)),get('unsent'));if(p<.44){wipe(letter,progress(p,.42,.44),'diagonal',1,mobile?.76:.5)}else draw(letter,1,1,mobile?.76:.5);
  show('unsent-copy',windowed(p,.426,.445,.522,.547));let text='';
  if(still||held>.3)text='I wish you were here.';
  else if(local<.38){const t=local<.23?progress(local,.04,.23):1-progress(local,.25,.38);text='made it home?'.slice(0,Math.round(t*13))}
  else if(local<.86){const t=local<.65?progress(local,.42,.65):1-progress(local,.7,.86);text='I miss you.'.slice(0,Math.round(t*11))}
  $('#unsent-copy').dataset.open=String(still||held>.3);$('#typed-thought').textContent=text;$('#typed-thought').style.color=still||held>.3?'#362316':'#fff0da';
 }
 if(p>=.54&&p<.67){const local=progress(p,.54,.65),scale=still?1:1.02+local*.035;
  if(p<.56)wipe(get('us-train'),progress(p,.54,.56),'diagonal',scale);else draw(get('us-train'),scale);
  wipe(get('us-street'),progress(local,.28,.40),'iris',scale);
  wipe(cafe,progress(local,.64,.76),'window',scale);
  show('us-copy',windowed(p,.549,.565,.64,.661));
 }
 if(p>=.65&&p<.77){const local=progress(p,.65,.75),image=film('distance',local,get('distance'));if(p<.67){wipe(image,progress(p,.65,.67),'window')}else if(!still&&!mobile){const gap=smooth(progress(p,.67,.75))*w*.055;ctx.save();ctx.beginPath();ctx.rect(0,0,w/2-gap,h);ctx.clip();draw(image,1,1,.5,-gap);ctx.restore();ctx.save();ctx.beginPath();ctx.rect(w/2+gap,0,w/2,h);ctx.clip();draw(image,1,1,.5,gap);ctx.restore()}else draw(image);
  show('distance-copy',windowed(p,.658,.68,.74,.76));$('#your-word').style.transform=`translateX(${-local*(mobile?5:35)}px)`;$('#side-word').style.transform=`translateX(${local*(mobile?5:35)}px)`;
 }
 if(p>=.75&&p<.84){const local=progress(p,.75,.82);draw(get('drawer'),still?1:1+local*.07,smooth(progress(p,.75,.766)));
  const shut=still?0:smooth(progress(local,.24,.58))*(1-smooth(progress(local,.7,.9)));const height=(h*.49)*Math.max(shut,held*.96);ctx.fillStyle='#07100f';ctx.fillRect(0,0,w,height);ctx.fillRect(0,h-height,w,height);
  if(!still&&local>.6){ctx.save();ctx.beginPath();ctx.rect(0,h*.5-h*.5*smooth(progress(local,.6,.86)),w,h*smooth(progress(local,.6,.86)));ctx.clip();draw(cafe,1.08,smooth(progress(local,.6,.84)));ctx.restore()}
  show('trying-copy',windowed(p,.753,.765,.809,.833));$('#trying-line').textContent=local>.63?'But there it was again.':'That should have been that.';
 }
 if(p>=.82&&p<.97){const local=progress(p,.82,.95);draw(get('hero-letters'),1,smooth(progress(p,.82,.837)));
  if(!still){if(local<.50){photo(cafe,progress(local,0,.25),.75,.4,-.12);if(!mobile)photo(get('us-street'),progress(local,.1,.38),.3,.65,.15);photo(get('unsent'),progress(local,.23,.48),.7,.5,-.08)}if(local>.40){const image=film('impossible',progress(local,.43,1),get('hero-letters'));draw(image,1,smooth(progress(local,.40,.50)),mobile?.72:.5)}}
  show('impossible-copy',windowed(p,.83,.848,.89,.916));
 }
 if(p>=.95){depthPlate('love-morning',1,smooth(progress(p,.95,.966)));const local=progress(p,.95,1);show('love-copy',smooth(progress(p,.958,.978)));$('#avoid-word').style.opacity=1-smooth(progress(local,.32,.8));}
 memory.draw(ctx,canvas,mistSource);gradeCopy(ctx,w,h,p);if(!still)letterLight(ctx,w,h,p,visitor,mobile);redThread(ctx,w,h,p,visitor,mobile,still);
 canvas.dataset.visitor=visitor.presence.toFixed(3);canvas.dataset.depth=String(!still&&depthAmount(p)>0);
 const light=p>.963;document.body.classList.toggle('on-light',light);
 $('#chapter-label').textContent=chapters[active].name;
 const interaction=[4,7].includes(active);holdButton.hidden=!interaction;holdButton.textContent=active===7?'Hold to put it away':'Hold the thought';
 $('#next-beat').innerHTML=p>.985?'Once more <span aria-hidden="true">↺</span>':p<.05?'Scroll a little closer <span aria-hidden="true">↓</span>':'Keep going <span aria-hidden="true">↓</span>';
 $('#next-beat').setAttribute('aria-label',p>.985?'Replay the story':'Continue the story');$('#progress-fill').style.transform=`scaleX(${p})`;
 canvas.dataset.progress=p.toFixed(4);canvas.dataset.chapter=chapters[active].id;canvas.dataset.frame=frameStats.frame;canvas.dataset.cached=[...sequences.values()].reduce((n,s)=>n+s.frames.size,0);canvas.dataset.film=frameStats.film;
 samples.push(performance.now()-started);if(samples.length>180)samples.shift();canvas.dataset.drawMs=Math.max(...samples).toFixed(2);canvas.dataset.errors=[...errors].join(',');
}
function tick(time){raf=0;if(document.hidden||$('#memory-dialog').open)return;const dt=last?Math.min(time-last,50):16;last=time;
 p=still?target:p+(target-p)*(1-Math.exp(-dt/85));if(Math.abs(target-p)<.00005)p=target;
 held+=(Number(holding)-held)*(1-Math.exp(-dt/160));if(Math.abs(Number(holding)-held)<.002)held=Number(holding);
 const visitorMoving=visitor.step(dt,!still&&nav.hidden&&!document.body.classList.contains('reading-active')&&([1,2,4,5,6,7,8,9].includes(active)));
 const next=Math.max(0,chapterIndex(p));if(next!==active){holding=false;holdButton.setAttribute('aria-pressed','false');active=next;prepareNearby();for(const a of nav.querySelectorAll('a'))a.setAttribute('aria-current',String(a.hash==='#'+chapters[active].id))}
 if(dirty||visitorMoving||p!==target||held!==Number(holding)){render();dirty=false}
 if(filmBlending||visitorMoving||p!==target||held!==Number(holding))invalidate();else last=0;
}
function updateTarget(){target=clamp(scrollY/Math.max(1,$('.scroll-track').offsetHeight-innerHeight));invalidate()}
function resize(){w=innerWidth;h=innerHeight;openingTravel=Math.min(40,Math.max(0,$('#opening').offsetTop-82));dpr=Math.min(devicePixelRatio||1,mobile?1.25:1.75);wipeCanvas.width=Math.round(w);wipeCanvas.height=Math.round(h);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);if(layoutReady&&!document.body.classList.contains('reading-active'))window.scrollTo({top:target*Math.max(1,$('.scroll-track').offsetHeight-innerHeight),behavior:'instant'});layoutReady=true;updateTarget();invalidate()}
function jump(value){window.scrollTo({top:value*Math.max(1,$('.scroll-track').offsetHeight-innerHeight),behavior:still?'instant':'smooth'})}
function menu(open){visitor.leave();invalidate();nav.hidden=!open;toggle.setAttribute('aria-expanded',String(open));if(open)$('#chapters-close').focus();else toggle.focus()}
function route(){memory.close();document.body.classList.toggle('reading-active',location.hash==='#reading');if(location.hash==='#reading'){$('#reading').focus();return}const c=chapters.find(c=>'#'+c.id===location.hash);if(c)jump(c.at)}
function listen(el,type,fn,options={}){el.addEventListener(type,fn,{...options,signal:abort.signal})}
// Passive touch input leaves native vertical scrolling and pinch zoom intact.
const visitorInput=e=>{if(still||!nav.hidden||$('#memory-dialog').open||e.target.closest('button,a,.reading')||document.body.classList.contains('reading-active'))return;if(![1,2,4,5,6,7,8,9].includes(active))return;visitor.move(e.clientX,e.clientY,w,h);invalidate()};
listen(window,'pointermove',visitorInput,{passive:true});listen(window,'pointerdown',visitorInput,{passive:true});
listen(window,'pointerup',e=>{if(e.pointerType!=='mouse'){visitor.leave();invalidate()}},{passive:true});
listen(window,'blur',()=>{visitor.leave();setHold(false);invalidate()});
listen(window,'pointercancel',()=>{visitor.leave();invalidate()},{passive:true});listen(document.documentElement,'pointerleave',()=>{visitor.leave();invalidate()});
listen(window,'scroll',updateTarget,{passive:true});listen(window,'resize',resize,{passive:true});listen(window,'hashchange',route);
listen(narrow,'change',()=>{mobile=narrow.matches;loadVersion++;plates.clear();plateLoads.clear();prepareNearby();setupMotion()});
listen(reduced,'change',()=>{const fraction=p;still=reduced.matches;setupMotion();jump(fraction)});
listen(document,'visibilitychange',()=>{if(!document.hidden)invalidate();else if(raf){cancelAnimationFrame(raf);raf=0}});
listen(window,'pagehide',()=>{for(const seq of sequences.values())seq.dispose();sequences.clear()});listen(window,'pageshow',e=>{if(e.persisted)setupMotion()});
listen(toggle,'click',()=>menu(nav.hidden));listen($('#chapters-close'),'click',()=>menu(false));
listen(nav,'keydown',e=>{if(e.key==='Escape')menu(false);if(e.key==='Tab'){const items=[...nav.querySelectorAll('a,button')];if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();items.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===items.at(-1)){e.preventDefault();items[0].focus()}}});
for(const a of nav.querySelectorAll('a'))listen(a,'click',e=>{e.preventDefault();menu(false);const c=chapters.find(c=>'#'+c.id===a.hash);if(c){history.replaceState(null,'',a.hash);jump(c.at)}});
listen($('#still-toggle'),'click',()=>{const fraction=p;still=!still;setupMotion();jump(fraction)});
listen($('#next-beat'),'click',()=>jump(p>.985?0:(chapters.find(c=>c.at>p+.02)?.at??1)));
const setHold=value=>{holding=value;holdButton.setAttribute('aria-pressed',String(value));invalidate()};
listen(holdButton,'pointerdown',e=>{holdButton.setPointerCapture(e.pointerId);setHold(true)});listen(holdButton,'pointerup',()=>setHold(false));listen(holdButton,'pointercancel',()=>setHold(false));listen(holdButton,'lostpointercapture',()=>setHold(false));listen(holdButton,'keydown',e=>{if([' ','Enter'].includes(e.key)){e.preventDefault();setHold(true)}});listen(holdButton,'keyup',e=>{if([' ','Enter'].includes(e.key))setHold(false)});listen(holdButton,'blur',()=>setHold(false));
for(const c of chapters){const el=$('#'+c.id);el.style.top=`${c.at*100}%`}
setupMotion();prepareNearby();plate('hero-cafe');
fetch('/film-manifest.json').then(r=>r.ok?r.json():null).then(m=>{manifest=m;invalidate()}).catch(()=>{});
if(location.hash)route();
if(import.meta.hot)import.meta.hot.dispose(()=>{memory.close();abort.abort();for(const seq of sequences.values())seq.dispose();if(raf)cancelAnimationFrame(raf)});
