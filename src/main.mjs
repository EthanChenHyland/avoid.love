import {clamp,progress,smooth,mix,cover,firstAct} from './timeline.mjs';
import {FrameSequence} from './sequence.mjs';
import {chapters,chapterIndex} from './story.mjs';
const $=s=>document.querySelector(s),canvas=$('#world'),ctx=canvas.getContext('2d',{alpha:false});
const narrow=matchMedia('(max-width:700px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
let still=reduced.matches,mobile=narrow.matches,w=innerWidth,h=innerHeight,dpr=1,p=0,target=0,raf=0,last=0,dirty=true,holding=false,held=0,active=0,manifest=null,loadVersion=0;
const plates=new Map(),plateLoads=new Map(),sequences=new Map(),errors=new Set(),abort=new AbortController();
const shots=['opening','opening-foot','notice-copy','late-copy','bridge-copy','little-copy','waiting-copy','unsent-copy','us-copy','distance-copy','trying-copy','impossible-copy','love-copy'].map(id=>$('#'+id));
const nav=$('#chapters'),toggle=$('#chapters-toggle'),holdButton=$('#hold-memory');
let samples=[],frameStats={frame:-1,cached:0,film:''};
function invalidate(){dirty=true;if(!raf&&!document.hidden)raf=requestAnimationFrame(tick)}
async function plate(name){
 if(plates.has(name))return plates.get(name);if(plateLoads.has(name))return plateLoads.get(name);
 const version=loadVersion;
 const promise=(async()=>{const img=new Image();img.src=`/art/${name}${mobile?'-mobile':''}.webp`;await img.decode();if(version===loadVersion){plates.set(name,img);invalidate()}return img})().catch(()=>{errors.add(name);return null}).finally(()=>plateLoads.delete(name));
 plateLoads.set(name,promise);return promise;
}
function prepareNearby(){
 const names=new Set([chapters[active]?.art,chapters[Math.min(9,active+1)]?.art,chapters[Math.max(0,active-1)]?.art]);
 if(active===6||active===7)names.add('hero-cafe');
 if(active===5){names.add('us-street');names.add('hero-cafe')}
 if(active===8){names.add('us-street');names.add('hero-cafe');names.add('unsent')}
 for(const name of names)if(name)plate(name);
 // Retain only the nearby chapter plates, plus the instant first-frame fallback.
 for(const name of plates.keys())if(!names.has(name)&&name!=='hero-poppy')plates.delete(name);
}
function setupMotion(){for(const seq of sequences.values())seq.dispose();sequences.clear();document.documentElement.dataset.still=String(still);$('#still-toggle').setAttribute('aria-pressed',String(still));resize()}
function film(name,t,fallback){
 if(still||!manifest?.[name]||(mobile&&['opening','waiting','distance'].includes(name)))return fallback;
 let seq=sequences.get(name);if(!seq){const m=manifest[name];seq=new FrameSequence({base:mobile?m.mobile:m.desktop,count:m.count,limit:mobile?12:24,onReady:invalidate});sequences.set(name,seq)}
 if(sequences.size>2){const old=[...sequences.keys()].find(k=>k!==name);sequences.get(old).dispose();sequences.delete(old)}
 const image=seq.get(t);frameStats={film:name,frame:seq.drawn,cached:[...sequences.values()].reduce((n,s)=>n+s.frames.size,0)};return image||fallback;
}
function draw(image,scale=1,alpha=1,focus=.5,dx=0,dy=0){if(!image||alpha<=0)return;const b=cover(image.width,image.height,w,h,focus,scale);ctx.globalAlpha=clamp(alpha);ctx.drawImage(image,b.x+dx,b.y+dy,b.w,b.h);ctx.globalAlpha=1}
function wipe(image,t,kind='diagonal',scale=1){
 if(!image||t<=0)return;if(t>=1){draw(image,scale);return}ctx.save();ctx.beginPath();
 if(still){ctx.restore();draw(image,1,t);return}
 if(kind==='window'){const width=w*smooth(t);ctx.rect(w-width,0,width,h)}
 else if(kind==='iris'){ctx.ellipse(w*.7,h*.65,w*t*1.5,h*t*1.7,0,0,Math.PI*2)}
 else{const edge=(1-t)*2*w;ctx.moveTo(edge,0);ctx.lineTo(w+10,0);ctx.lineTo(w+10,h+10);ctx.lineTo(edge-w,h+10);ctx.closePath()}
 ctx.clip();draw(image,scale);ctx.restore();
}
const show=(id,opacity)=>{const el=$('#'+id);el.style.opacity=clamp(opacity);};
const windowed=(x,a,b,c,d)=>smooth(progress(x,a,b))*(1-smooth(progress(x,c,d)));
function photo(image,t,x=.5,y=.5,angle=0){if(!image)return;const q=smooth(t),cw=mix(w*.18,w*1.15,q),ch=cw*image.height/image.width;ctx.save();ctx.translate(mix(w*x,w*.5,q),mix(h*y,h*.5,q));ctx.rotate(angle*(1-q));ctx.globalAlpha=smooth(progress(t,0,.13))*(1-smooth(progress(t,.86,1)));ctx.fillStyle='#eee3d1';ctx.fillRect(-cw/2-6,-ch/2-6,cw+12,ch+12);ctx.drawImage(image,-cw/2,-ch/2,cw,ch);ctx.restore();ctx.globalAlpha=1}
function render(){
 const started=performance.now();canvas.style.opacity=plates.size?'1':'0';for(const el of shots)el.style.opacity=0;$('#foreground').style.opacity=0;ctx.fillStyle='#101b1d';ctx.fillRect(0,0,w,h);frameStats={frame:-1,cached:0,film:''};
 const get=n=>plates.get(n),hero=get('hero-poppy'),cafe=get('hero-cafe'),q=p/.23;
 if(p<.255){
  const a=firstAct(q),zoom=still?1:1+smooth(progress(q,.05,.29))*.065;
  draw(hero,zoom);
  if(!still&&q>.035&&q<.29){const opening=film('opening',progress(q,.035,.29),hero);draw(opening,1,smooth(progress(q,.035,.065)),mobile?.77:.5)}
  if(still)draw(cafe,1,smooth(progress(q,.42,.58)));
  else if(q>.29&&q<.83){const frame=film('transition',a.film,null);if(frame)draw(frame,1,Math.min(progress(q,.29,.32),1-progress(q,.79,.83)),mobile?.77:.5);else draw(cafe,1.03,smooth(progress(q,.4,.72)))}
  if(q>=.74)draw(cafe,still?1:mix(1.03,1,smooth(a.hold)),smooth(progress(q,.74,.81)));
  const op=still?1-smooth(progress(q,.36,.46)):a.hero;show('opening',op);show('opening-foot',op);
  $('#opening').style.transform=`translateY(${still?0:-progress(q,.03,.3)*40}px) scale(${still?1:1+progress(q,.02,.3)*.025})`;
  $('#foreground').style.opacity=still?0:op*(1-smooth(progress(q,.025,.065)));$('#foreground').style.transform=`scale(${zoom})`;
  show('bridge-copy',still?0:windowed(q,.43,.47,.54,.59));
  show('notice-copy',(still?smooth(progress(q,.55,.62)):a.cafe)*(1-smooth(progress(q,.91,.98))));
  show('late-copy',smooth(progress(q,.92,.99))*(1-smooth(progress(p,.225,.25))));
 }
 if(p>=.23&&p<.335){const local=progress(p,.23,.31);if(p<.255){draw(cafe,1.04);wipe(get('little-things'),progress(p,.23,.255),'diagonal',1)}else draw(get('little-things'),still?1:1+local*.09);
  show('little-copy',windowed(p,.24,.26,.298,.32));$('#little-copy').style.transform=`translateY(${still?0:-local*20}px)`;
 }
 if(p>=.31&&p<.44){const local=progress(p,.31,.42),rain=film('waiting',local,get('waiting'));if(p<.335){draw(get('little-things'),1.09);wipe(rain,progress(p,.31,.335),'window')}else draw(rain,1,1,mobile?.77:.5);
  show('waiting-copy',windowed(p,.32,.34,.409,.435));$('#clock-time').textContent='1:'+String(13+Math.floor(local*4)).padStart(2,'0');$('.waiting-line').textContent=local>.63?'Still nothing.':'Nothing yet.';
 }
 if(p>=.42&&p<.56){const local=progress(p,.42,.54),letter=film('unsent',held>.2?.05:local,get('unsent'));if(p<.44){draw(get('waiting'));wipe(letter,progress(p,.42,.44),'diagonal')}else draw(letter,1,1,mobile?.76:.5);
  show('unsent-copy',windowed(p,.426,.445,.522,.547));let text='';
  if(still||held>.3)text='I wish you were here.';
  else if(local<.38){const t=local<.23?progress(local,.04,.23):1-progress(local,.25,.38);text='made it home?'.slice(0,Math.round(t*13))}
  else if(local<.86){const t=local<.65?progress(local,.42,.65):1-progress(local,.7,.86);text='I miss you.'.slice(0,Math.round(t*11))}
  $('#typed-thought').textContent=text;$('#typed-thought').style.color=still||held>.3?'#362316':'#fff0da';
 }
 if(p>=.54&&p<.67){const local=progress(p,.54,.65);let image=get('us-train');if(local>.33)image=get('us-street');if(local>.68)image=cafe;
  if(p<.56){draw(get('unsent'));wipe(image,progress(p,.54,.56),'diagonal')}else draw(image,still?1:1.02+(local% .33)*.12);
  if(!still&&local>.28&&local<.4)wipe(get('us-street'),progress(local,.28,.4),'iris');
  if(!still&&local>.64&&local<.74)wipe(cafe,progress(local,.64,.74),'window');
  show('us-copy',windowed(p,.549,.565,.64,.661));
 }
 if(p>=.65&&p<.77){const local=progress(p,.65,.75),image=film('distance',local,get('distance'));if(p<.67){draw(cafe);wipe(image,progress(p,.65,.67),'window')}else if(!still&&!mobile){const gap=smooth(local)*w*.055;ctx.save();ctx.beginPath();ctx.rect(0,0,w/2-gap,h);ctx.clip();draw(image,1,1,.5,-gap);ctx.restore();ctx.save();ctx.beginPath();ctx.rect(w/2+gap,0,w/2,h);ctx.clip();draw(image,1,1,.5,gap);ctx.restore()}else draw(image);
  show('distance-copy',windowed(p,.658,.68,.74,.76));$('#your-word').style.transform=`translateX(${-local*(mobile?5:35)}px)`;$('#side-word').style.transform=`translateX(${local*(mobile?5:35)}px)`;
 }
 if(p>=.75&&p<.84){const local=progress(p,.75,.82);draw(get('drawer'),still?1:1+local*.07,smooth(progress(p,.75,.766)));
  const shut=still?0:smooth(progress(local,.24,.58))*(1-smooth(progress(local,.7,.9)));const height=(h*.49)*Math.max(shut,held*.96);ctx.fillStyle='#07100f';ctx.fillRect(0,0,w,height);ctx.fillRect(0,h-height,w,height);
  if(!still&&local>.6){ctx.save();ctx.beginPath();ctx.rect(0,h*.5-h*.5*smooth(progress(local,.6,.86)),w,h*smooth(progress(local,.6,.86)));ctx.clip();draw(cafe,1.08,smooth(progress(local,.6,.84)));ctx.restore()}
  show('trying-copy',windowed(p,.753,.765,.809,.833));$('#trying-line').textContent=local>.63?'But there it was again.':'That should have been that.';
 }
 if(p>=.82&&p<.965){const local=progress(p,.82,.95);draw(get('hero-letters'),1,smooth(progress(p,.82,.837)));
  if(!still){if(local<.45){photo(cafe,progress(local,0,.25),.75,.4,-.12);if(!mobile)photo(get('us-street'),progress(local,.1,.38),.3,.65,.15);photo(get('unsent'),progress(local,.23,.48),.7,.5,-.08)}else{const image=film('impossible',progress(local,.43,1),get('hero-letters'));draw(image,1,smooth(progress(local,.43,.48)),mobile?.72:.5)}}
  show('impossible-copy',windowed(p,.83,.848,.89,.916));
 }
 if(p>=.95){draw(get('love-morning'),1,smooth(progress(p,.95,.966)));const local=progress(p,.95,1);show('love-copy',smooth(progress(p,.958,.978)));$('#avoid-word').style.opacity=1-smooth(progress(local,.32,.8));}
 const light=p>.963;document.body.classList.toggle('on-light',light);
 $('#chapter-label').textContent=chapters[active].name;
 const interaction=[4,7].includes(active);holdButton.hidden=!interaction;holdButton.textContent=active===7?'Hold to put it away':'Hold the thought';
 $('#next-beat').innerHTML=p>.985?'Once more <span aria-hidden="true">↺</span>':p<.05?'Scroll a little closer <span aria-hidden="true">↓</span>':'Keep going <span aria-hidden="true">↓</span>';
 $('#next-beat').setAttribute('aria-label',p>.985?'Replay the story':'Continue the story');$('#progress-fill').style.transform=`scaleX(${p})`;
 canvas.dataset.progress=p.toFixed(4);canvas.dataset.chapter=chapters[active].id;canvas.dataset.frame=frameStats.frame;canvas.dataset.cached=[...sequences.values()].reduce((n,s)=>n+s.frames.size,0);canvas.dataset.film=frameStats.film;
 samples.push(performance.now()-started);if(samples.length>180)samples.shift();canvas.dataset.drawMs=Math.max(...samples).toFixed(2);canvas.dataset.errors=[...errors].join(',');
}
function tick(time){raf=0;if(document.hidden)return;const dt=last?Math.min(time-last,50):16;last=time;
 p=still?target:p+(target-p)*(1-Math.exp(-dt/85));if(Math.abs(target-p)<.00005)p=target;
 held+=(Number(holding)-held)*(1-Math.exp(-dt/160));if(Math.abs(Number(holding)-held)<.002)held=Number(holding);
 const next=Math.max(0,chapterIndex(p));if(next!==active){active=next;prepareNearby();for(const a of nav.querySelectorAll('a'))a.setAttribute('aria-current',String(a.hash==='#'+chapters[active].id))}
 if(dirty||p!==target||held!==Number(holding)){render();dirty=false}
 if(p!==target||held!==Number(holding))invalidate();else last=0;
}
function updateTarget(){target=clamp(scrollY/Math.max(1,$('.scroll-track').offsetHeight-innerHeight));invalidate()}
function resize(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,mobile?1.25:1.75);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);updateTarget();invalidate()}
function jump(value){window.scrollTo({top:value*Math.max(1,$('.scroll-track').offsetHeight-innerHeight),behavior:still?'instant':'smooth'})}
function menu(open){nav.hidden=!open;toggle.setAttribute('aria-expanded',String(open));if(open)$('#chapters-close').focus();else toggle.focus()}
function route(){document.body.classList.toggle('reading-active',location.hash==='#reading');if(location.hash==='#reading'){$('#reading').focus();return}const c=chapters.find(c=>'#'+c.id===location.hash);if(c)jump(c.at)}
function listen(el,type,fn,options={}){el.addEventListener(type,fn,{...options,signal:abort.signal})}
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
if(import.meta.hot)import.meta.hot.dispose(()=>{abort.abort();for(const seq of sequences.values())seq.dispose();if(raf)cancelAnimationFrame(raf)});
