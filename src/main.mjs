import {drawNewChapters} from './three-chapters.mjs';
import {drawSceneAtmosphere} from './scene-atmosphere.mjs';
import {expansionBeats} from './expansion.mjs';
import {drawExpansionScenes} from './expansion-scenes.mjs';
import {livingBackground} from './living-background.mjs';
import {finale} from './finale.mjs';
import {clamp,progress,smooth,mix,cover,firstAct,motionScale,keptFilmProgress} from './timeline.mjs';
import {storyToScroll,scrollToStory} from './scroll-map.mjs';
import {FilmSurface} from './film-surface.mjs';
import {FrameSequence} from './sequence.mjs';
import {chapters,chapterIndex,narrative} from './story.mjs';
import {bookInput} from './book-input.mjs';
import {materialResponse} from './material-response.mjs';
import {materialScenes} from './material-scenes.mjs';
import {chapterEffects} from './chapter-effects.mjs';
import {playthings} from './playthings.mjs';
import {memories} from './memory.mjs';
import {Visitor,depthAmount,gradeCopy,letterLight,redThread} from './interaction.mjs';
const visitor=new Visitor();
const $=s=>document.querySelector(s),canvas=$('#world'),ctx=canvas.getContext('2d',{alpha:false});
const wipeCanvas=document.createElement('canvas'),wipeCtx=wipeCanvas.getContext('2d');
const narrow=matchMedia('(max-width:700px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
let still=reduced.matches,mobile=narrow.matches,w=innerWidth,h=innerHeight,dpr=1,p=0,target=0,raf=0,last=0,dirty=true,holding=false,held=0,active=0,manifest=null,loadVersion=0;
const endpoints=new Map(),plates=new Map(),plateLoads=new Map(),sequences=new Map(),errors=new Set(),abort=new AbortController();
const shots=['opening','opening-foot','notice-copy','late-copy','bridge-copy','little-copy','waiting-copy','unsent-copy','us-copy','distance-copy','trying-copy','impossible-copy','love-copy','hours-copy','detour-copy','light-copy','pressed-copy','blue-copy','space-copy','unsaid-copy','kept-copy','stay-copy','address-copy',...expansionBeats.map(b=>b.id+'-copy')].map(id=>$('#'+id));
const nav=$('#chapters'),toggle=$('#chapters-toggle'),holdButton=$('#hold-memory'),letterObject=$('#letter-object');let letterPinned=false;
let openingTravel=0,layoutReady=false;
let filmBlending=false,mistSource=null;
const memory=memories({state:()=>({p,w,h,mobile,still}),wake:invalidate,signal:abort.signal});
const play=playthings({state:()=>({p,w,h,mobile,still,visitor}),wake:invalidate,signal:abort.signal});
const book=bookInput({state:()=>({turn:smooth(progress(p,.291,.303))}),wake:invalidate,signal:abort.signal});
const materials=materialScenes();
const living=livingBackground({state:()=>({p,still,mobile,obscured:!nav.hidden||document.body.classList.contains('reading-active')}),wake:invalidate,signal:abort.signal});
const bloom=finale({state:()=>({p,w,h,mobile,still,visitor})});
const tactile=materialResponse({state:()=>({p,w,h,still}),wake:invalidate,signal:abort.signal});
const enhancements=chapterEffects({state:()=>({p,w,h,mobile,still,visitor,plates}),wake:invalidate,signal:abort.signal});
$('.chapter-links').replaceChildren(...narrative.map(c=>{const a=document.createElement('a');a.href='#'+c.id;a.textContent=c.name;return a}));
let samples=[],frameStats={frame:-1,cached:0,film:''};
function invalidate(){dirty=true;if(!raf&&!document.hidden)raf=requestAnimationFrame(tick)}
async function plate(name){
 if(plates.has(name)&&plates.get(name).mobile===mobile)return plates.get(name);if(plateLoads.has(name))return plateLoads.get(name);
 const version=loadVersion;
 const promise=(async()=>{const img=new Image();img.src=`/art/${name}${mobile?'-mobile':''}.webp`;await img.decode();if(version===loadVersion){img.readyAt=performance.now();img.mobile=mobile;const previous=plates.get(name);if(previous&&previous.mobile!==mobile)img.previous=previous;plates.set(name,img);invalidate()}return img})().catch(()=>{errors.add(name);return null}).finally(()=>{if(plateLoads.get(name)===promise)plateLoads.delete(name)});
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
function sequence(name){
 let seq=sequences.get(name);if(!seq){const m=manifest[name];seq=new FrameSequence({base:m.desktop,count:m.count,limit:mobile?8:24,onReady:invalidate});seq.surface=new FilmSurface({blendFrames:!['opening','transition'].includes(name)});sequences.set(name,seq)}
 // Keep the film we just drew most recent. Insertion order alone evicts a visible
 // drawer when reverse scrolling brings the distance film back into the cache.
 sequences.delete(name);sequences.set(name,seq);
 if(sequences.size>2){const old=[...sequences.keys()].find(k=>k!==name);sequences.get(old).dispose();sequences.delete(old)}return seq;
}
function warmFilm(name){if(sequences.has(name))return;if(!still&&manifest?.[name])sequence(name).request(0)}
function prepareFilms(){const name=active===0?'opening':active===2?'waiting':active===3?'unsent':active===5?'distance':active===6||active===7?'kept':active>=8?'impossible':null;if(name)warmFilm(name)}
function film(name,t,fallback){
 if(still||!manifest?.[name])return fallback;
 const seq=sequence(name);
 const raw=seq.get(t),image=seq.surface.sample(seq,raw,t);if(seq.surface.moving)filmBlending=true;if(image&&!seq.readyAt)seq.readyAt=performance.now();const blend=image?(['opening','transition','stay','pause','proof','home','spare'].includes(name)?1:smooth(clamp((performance.now()-seq.readyAt)/220))):0;if(image&&blend<1)filmBlending=true;frameStats={film:name,frame:seq.drawn,cached:[...sequences.values()].reduce((n,s)=>n+s.frames.size,0)};if(image&&blend===1&&t>=.999&&seq.drawn===seq.count-1&&!seq.surface.moving&&!endpoints.has(name)&&['opening','transition','impossible','stay','spare'].includes(name)){const held=document.createElement('canvas');held.width=image.width;held.height=image.height;held.getContext('2d').drawImage(image,0,0);endpoints.set(name,held)}return image?{filmImage:image,fallback:endpoints.get(name)||fallback,blend}:endpoints.get(name)||fallback;
}
function filmFocus(max){return mix(.5,max,smooth(progress(h/w,.75,1)))}
function draw(image,scale=1,alpha=1,focus=.5,dx=0,dy=0,dc=ctx){if(!image||alpha<=0)return;if(image.filmImage){if(image.blend<1)draw(image.fallback,scale,alpha,focus,dx,dy,dc);draw(image.filmImage,scale,alpha*image.blend,focus,dx,dy,dc);return}if(image.previous){const blend=still?1:smooth(clamp((performance.now()-image.readyAt)/400));if(blend<1){filmBlending=true;draw(image.previous,scale,alpha,focus,dx,dy,dc);alpha*=blend}else delete image.previous}const b=cover(image.width,image.height,w,h,focus,scale);dc.globalAlpha=clamp(alpha);dc.drawImage(image,b.x+dx,b.y+dy,b.w,b.h);dc.globalAlpha=1}
function plateOpacity(name,alpha){const image=plates.get(name);if(!image)return 0;if(image.previous)return alpha;const ready=still?1:smooth(clamp((performance.now()-image.readyAt)/400));if(ready<1)filmBlending=true;return alpha*ready}
function depthPlate(name,scale=1,alpha=1,baseImage=null){
 const amount=still?0:depthAmount(p),gain=mobile?.5:1;
 const bx=(visitor.x*2+Math.sin(p*45)*5)*amount*gain,by=(visitor.y*1.5+Math.cos(p*30)*3)*amount*gain;
 const fx=(visitor.x*12+Math.sin(p*45)*9)*amount*gain,fy=(visitor.y*8+Math.cos(p*30)*6)*amount*gain;
 // A portrait crop magnifies the feathered duplicate into a second cup/table edge.
 // Keep portrait depth on one continuous image; desktop layers share one crop scale.
 const layered=!baseImage&&w>=h&&!mobile&&amount&&plates.has(name+'-depth');
 const baseScale=motionScale(w,h,scale+amount*.012,bx,by),safeScale=layered?Math.max(baseScale,motionScale(w,h,scale+amount*.012,fx,fy)):baseScale;
 draw(baseImage||plates.get(name),safeScale,alpha,.5,bx,by);
 if(layered)draw(plates.get(name+'-depth'),safeScale,plateOpacity(name+'-depth',alpha*amount),.5,fx,fy);
}
function wipe(image,t,kind='diagonal',scale=1,focus=.5){
 if(!image||t<=0)return;if(t>=1){draw(image,scale,1,focus);return}if(still){draw(image,scale,smooth(t),focus);return}
 // A feathered optical edge, with endpoints entirely outside the viewport.
 const f=w*.035,k=smooth(t);wipeCtx.clearRect(0,0,w,h);draw(image,scale,1,focus,0,0,wipeCtx);wipeCtx.save();wipeCtx.globalCompositeOperation='destination-in';let mask;
 if(kind==='iris'){const radius=Math.hypot(w,h)*k;mask=wipeCtx.createRadialGradient(w*.7,h*.65,Math.max(0,radius-f),w*.7,h*.65,radius+f);mask.addColorStop(0,'#000');mask.addColorStop(1,'transparent')}
 else{const edge=mix(kind==='diagonal'?2*w+f:w+f,-f,k);if(kind==='diagonal')wipeCtx.transform(1,0,-w/h,1,0,0);mask=wipeCtx.createLinearGradient(edge-f,0,edge+f,0);mask.addColorStop(0,'transparent');mask.addColorStop(1,'#000')}
 wipeCtx.fillStyle=mask;wipeCtx.fillRect(-w,0,w*3,h);wipeCtx.restore();ctx.drawImage(wipeCanvas,0,0,w,h);
}
// Exclusive copy intervals keep outgoing and incoming headlines from sharing the lens.
const copyRanges={'notice-copy':[.13,.226],'late-copy':[.226,.242],'little-copy':[.244,.318],'waiting-copy':[.32,.43],'unsent-copy':[.432,.548],'us-copy':[.55,.659],'distance-copy':[.661,.753],'trying-copy':[.755,.828],'impossible-copy':[.83,.948],'love-copy':[.95,1.02]};
const show=(id,opacity)=>{const bounds=copyRanges[id];const gate=bounds?smooth(progress(p,bounds[0],bounds[0]+.003))*(1-smooth(progress(p,bounds[1]-.003,bounds[1]))):1;$('#'+id).style.opacity=clamp(opacity*gate);};
const windowed=(x,a,b,c,d)=>smooth(progress(x,a,b))*(1-smooth(progress(x,c,d)));
function render(){
 const started=performance.now();filmBlending=false;if(p>.03&&p<.065)warmFilm('transition');if(p>.79&&p<.82)warmFilm('impossible');if(p>.94&&p<.95)warmFilm('spare');if(p>=.966)warmFilm('stay');mistSource=null;canvas.style.opacity=plates.size?'1':'0';for(const el of shots)el.style.opacity=0;$('#foreground').style.opacity=0;ctx.fillStyle='#101b1d';ctx.fillRect(0,0,w,h);frameStats={frame:-1,cached:0,film:''};
 const get=n=>plates.get(n),hero=get('hero-poppy'),cafe=get('hero-cafe'),q=p/.23;
 const portrait=w/h<1,ending=plateOpacity('love-morning',smooth(progress(p,.95,portrait?.982:.966)));
 const littleAlpha=plateOpacity('little-things',smooth(progress(p,.242,portrait?.280:.273)));
 const cafeView=!still&&p>=.23&&p<.345&&littleAlpha<1?film('pause',progress(p,.225,.242),endpoints.get('transition')||cafe):cafe;
 if(p<.255){
  const a=firstAct(q);
  draw(hero,1,1,filmFocus(.77));
  if(still)draw(cafe,1,plateOpacity('hero-cafe',smooth(progress(q,.42,.58))));
  else if(p>=.185){draw(film('pause',progress(p,.225,.242),endpoints.get('transition')||cafe),1,1,filmFocus(.77));}
  else {
   // The opening uses opaque decoded frames only: no join, loading or catch-up dissolve.
   const handoff=a.handoff,incoming=sequences.get('transition');
   const ready=incoming?.frames.size&&incoming.readyAt;
   const outgoing=handoff<1||!ready?film('opening',a.opening,hero):endpoints.get('opening')||hero;
   draw(outgoing,1,1,filmFocus(.77));
   if(q>.29)draw(film('transition',a.film,outgoing),1,handoff,filmFocus(.77));
  }
  const op=still?1-smooth(progress(q,.36,.46)):a.hero;show('opening',op);show('opening-foot',op);
  $('#opening').style.transform=`translateY(${still?0:-progress(q,.03,.3)*openingTravel}px) scale(${still?1:1+progress(q,.02,.3)*.025})`;
  $('#foreground').style.opacity=0;$('#foreground').style.transform='none';$('#foreground').style.objectPosition=`${filmFocus(.77)*100}% center`;
  show('bridge-copy',still?0:windowed(q,.43,.47,.54,.59));
  show('notice-copy',(still?smooth(progress(q,.55,.62)):a.cafe)*(1-smooth(progress(p,.197,.205))));
  show('late-copy',0);
 }
 if(p>=.23&&p<.345){const local=progress(p,.23,.31);if(littleAlpha<1)draw(cafeView,1,1,filmFocus(.77));depthPlate('little-things',still?1:1+local*.09,littleAlpha,littleAlpha>0&&!still?film('proof',progress(p,.309,.324),get('little-things')):null);
  show('little-copy',windowed(p,.243,.26,.276,.284));$('#little-copy').style.transform=`translateY(${still?0:-local*20}px)`;
 }
 if(p>=.324&&p<.44){const local=progress(p,.324,.42),rain=film('waiting',local,get('waiting'));mistSource=rain;if(p<.345){wipe(rain,progress(p,.324,.345),'window',1,filmFocus(.77))}else draw(rain,1,1,filmFocus(.77));
  show('waiting-copy',windowed(p,.325,.344,.379,.389));$('#clock-time').textContent='1:'+String(13+Math.floor(local*4)).padStart(2,'0');$('.waiting-line').textContent=local>.63?'Still nothing.':'Nothing yet.';
 }
 if(p>=.42&&p<.56){const local=progress(p,.42,.54),letter=film('unsent',mix(local,.05,smooth(held)),get('unsent'));if(p<.44){wipe(letter,progress(p,.42,.44),'diagonal',1,filmFocus(.76))}else draw(letter,1,1,filmFocus(.76));
  show('unsent-copy',windowed(p,.470,.478,.500,.512));let text='';
  if(still||held>.3)text='I wish you were here.';
  else if(local<.38){const t=local<.23?progress(local,.04,.23):1-progress(local,.25,.38);text='made it home?'.slice(0,Math.round(t*13))}
  else if(local<.86){const t=local<.65?progress(local,.42,.65):1-progress(local,.7,.86);text='I miss you.'.slice(0,Math.round(t*11))}
  $('#unsent-copy').dataset.open=String(still||held>.3);$('#typed-thought').textContent=text;$('#typed-thought').style.color=still||held>.3?'#362316':'#fff0da';
 }
 if(p>=.54&&p<.67){const local=progress(p,.54,.65),scale=still?1:1.02+local*.035;
  if(p<.56)wipe(get('us-train'),progress(p,.54,.56),'diagonal',scale);else draw(get('us-train'),scale);
  if(local>.28)wipe(film('home',progress(p,.598,.614),get('us-street')),progress(local,.28,.40),'iris',scale);
  wipe(cafe,progress(p,.614,.628),'window',scale);
  show('us-copy',windowed(p,.549,.565,.588,.598));
 }
 if(p>=.65&&p<.77){const local=progress(p,.65,.75),image=film('distance',local,get('distance'));if(p<.67){wipe(image,progress(p,.65,.67),'window')}else if(!still&&w>h){const gap=smooth(progress(p,.67,.75))*w*.055*smooth(progress(w/h,1,1.5));ctx.save();ctx.beginPath();ctx.rect(0,0,w/2-gap,h);ctx.clip();draw(image,1,1,.5,-gap);ctx.restore();ctx.save();ctx.beginPath();ctx.rect(w/2+gap,0,w/2,h);ctx.clip();draw(image,1,1,.5,gap);ctx.restore()}else draw(image);
  show('distance-copy',windowed(p,.658,.68,.694,.704));$('#your-word').style.transform=`translateX(${-local*(mobile?5:35)}px)`;$('#side-word').style.transform=`translateX(${local*(mobile?5:35)}px)`;
 }
 if(p>=.75&&p<.84){const local=progress(p,.75,.82),drawer=film('kept',keptFilmProgress(p),get('drawer'));
  if(p<.77)wipe(drawer,progress(p,.75,.77),'window',1,filmFocus(.72));else draw(drawer,1,1,filmFocus(.72));
  show('trying-copy',windowed(p,.753,.765,.775,.782));$('#trying-line').textContent=local>.63?'But there it was again.':'That should have been that.';
 }
 if(p>=.82&&p<.95){const local=progress(p,.82,.95),room=film('impossible',progress(local,.43,1),get('hero-letters'));
  if(p<.84)wipe(room,progress(p,.82,.84),'diagonal',1,filmFocus(.72));else draw(room,1,1,filmFocus(.72));
  show('impossible-copy',windowed(p,.83,.848,.890,.896));
 }
 if(p>=.95){if(still)depthPlate('love-morning',1,ending);else{const morning=endpoints.get('spare')||endpoints.get('impossible')||film('impossible',1,get('love-morning')||get('hero-letters'));draw(p>=.966?film('stay',smooth(progress(p,.969,.986)),morning):morning,1,1,filmFocus(.72));}show('stay-copy',windowed(p,.965,.971,.984,.988));show('love-copy',smooth(progress(p,.997,1)));$('#avoid-word').style.opacity=1-smooth(progress(p,.997,.9998));}
 if(p>=.948&&p<.966)wipe(film('spare',progress(p,.952,.965),endpoints.get('impossible')||get('love-morning')),progress(p,.948,.952),'window',1,filmFocus(.72));
 const livingFrame=living.sample();if(livingFrame)wipe(livingFrame,progress(p,.988,.994),'window',1,filmFocus(.72));canvas.dataset.background=living.status;canvas.dataset.backgroundTime=living.time.toFixed(3);
 drawSceneAtmosphere(ctx,{p,w,h,mobile,still,visitor});memory.draw(ctx,canvas,mistSource);gradeCopy(ctx,w,h,p);if(!still)letterLight(ctx,w,h,p,visitor,mobile);redThread(ctx,w,h,p,visitor,mobile,still);
 tactile.update();play.draw(ctx);enhancements.draw(ctx);book.update(p>.290&&p<.305?{x:w*(mobile?.20:.56),y:h*(mobile?.58:.43),w:w*(mobile?.78:.40),h:h*.30}:null);materials.draw(ctx,{p,w,h,mobile,still,visitor,bookTurn:book.turn,tactile});drawExpansionScenes(ctx,{p,w,h,mobile,still,visitor});drawNewChapters(ctx,{p,w,h,mobile,still,visitor,plates});bloom.draw(ctx);for(const beat of expansionBeats)show(beat.id+'-copy',windowed(p,...beat.range));
 show('hours-copy',windowed(p,.205,.212,.220,.225));show('detour-copy',windowed(p,.614,.621,.641,.649));show('light-copy',windowed(p,.917,.925,.940,.947));show('pressed-copy',windowed(p,.285,.292,.303,.309));show('blue-copy',windowed(p,.390,.399,.414,.421));show('space-copy',windowed(p,.720,.728,.744,.751));show('unsaid-copy',windowed(p,.514,.520,.524,.530));show('address-copy',windowed(p,.530,.534,.543,.548));show('kept-copy',windowed(p,.782,.788,.814,.822));
 canvas.dataset.rendition=portrait?'portrait-film':'landscape-film';canvas.dataset.visitor=visitor.presence.toFixed(3);canvas.dataset.depth=String(!still&&depthAmount(p)>0);
 document.documentElement.style.setProperty('--mast-shade',String(1-smooth(progress(p,.95,.98))));const light=p>.963;document.body.classList.toggle('on-light',light);$('.stage').style.setProperty('--stage-shade',String(1-ending));
 const beat=[...narrative].reverse().find(c=>c.at<=p+.002)||narrative[0];$('#chapter-label').textContent=beat.name;canvas.dataset.beat=beat.id;for(const a of nav.querySelectorAll('a'))a.setAttribute('aria-current',String(a.hash==='#'+beat.id));
 letterObject.hidden=!(p>.475&&p<.53);if(letterObject.hidden&&letterPinned){letterPinned=false;holding=false;letterObject.setAttribute('aria-pressed','false')}
 const interaction=[4,7].includes(active);holdButton.hidden=true;holdButton.textContent=active===7?'Hold to put it away':'Hold the thought';
 $('#next-beat').innerHTML=p>.985?'Once more <span aria-hidden="true">↺</span>':p<.05?'Scroll a little closer <span aria-hidden="true">↓</span>':'Keep going <span aria-hidden="true">↓</span>';
 $('#next-beat').setAttribute('aria-label',p>.985?'Replay the story':'Continue the story');$('#progress-fill').style.transform=`scaleX(${p})`;
 canvas.dataset.progress=p.toFixed(4);canvas.dataset.chapter=chapters[active].id;canvas.dataset.frame=frameStats.frame;canvas.dataset.cached=[...sequences.values()].reduce((n,s)=>n+s.frames.size,0);canvas.dataset.film=frameStats.film;
 samples.push(performance.now()-started);if(samples.length>180)samples.shift();canvas.dataset.drawMs=Math.max(...samples).toFixed(2);canvas.dataset.errors=[...errors].join(',');
}
function tick(time){raf=0;if(document.hidden||document.querySelector('dialog[open]'))return;const dt=last?Math.min(time-last,50):16;last=time;
 p=still?target:p+(target-p)*(1-Math.exp(-dt/85));if(Math.abs(target-p)<.00005)p=target;
 held+=(Number(holding)-held)*(1-Math.exp(-dt/160));if(Math.abs(Number(holding)-held)<.002)held=Number(holding);
 const visitorMoving=visitor.step(dt,!still&&nav.hidden&&!document.body.classList.contains('reading-active')&&([0,1,2,3,4,5,6,7,8,9].includes(active)));
 const next=Math.max(0,chapterIndex(p));if(next!==active){holding=false;holdButton.setAttribute('aria-pressed','false');active=next;prepareNearby();prepareFilms();for(const a of nav.querySelectorAll('a'))a.setAttribute('aria-current',String(a.hash==='#'+([...narrative].reverse().find(c=>c.at<=p+.002)?.id||'before')))}
 if(dirty||visitorMoving||p!==target||held!==Number(holding)){render();dirty=false}
 if(living.moving||bloom.moving||tactile.moving||book.moving||memory.moving||play.moving||enhancements.moving||filmBlending||visitorMoving||p!==target||held!==Number(holding))invalidate();else last=0;
}
function scrollGeometry(){return [Math.max(1,$('.scroll-track').offsetHeight-innerHeight),$('.kept-scroll-room').offsetHeight,$('.key-scroll-room').offsetHeight,$('.stay-scroll-room').offsetHeight,$('.clock-scroll-room').offsetHeight,$('.address-scroll-room').offsetHeight,$('.expansion-scroll-room').offsetHeight]}
function updateTarget(){target=scrollToStory(scrollY,...scrollGeometry());invalidate()}
function resize(){w=innerWidth;h=innerHeight;openingTravel=Math.min(40,Math.max(0,$('#opening').offsetTop-82));dpr=Math.min(devicePixelRatio||1,mobile?1.25:1.75);wipeCanvas.width=Math.round(w);wipeCanvas.height=Math.round(h);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);if(layoutReady&&!document.body.classList.contains('reading-active'))window.scrollTo({top:storyToScroll(target,...scrollGeometry()),behavior:'instant'});layoutReady=true;updateTarget();invalidate()}
function jump(value){window.scrollTo({top:storyToScroll(value,...scrollGeometry()),behavior:still?'instant':'smooth'})}
function menu(open){visitor.leave();invalidate();nav.hidden=!open;toggle.setAttribute('aria-expanded',String(open));if(open)$('#chapters-close').focus();else toggle.focus()}
function route(){memory.close();play.close();document.body.classList.toggle('reading-active',location.hash==='#reading');if(location.hash==='#reading'){$('#reading').focus();return}const c=narrative.find(c=>'#'+c.id===location.hash);if(c)jump(c.at)}
function listen(el,type,fn,options={}){el.addEventListener(type,fn,{...options,signal:abort.signal})}
// Passive touch input leaves native vertical scrolling and pinch zoom intact.
const visitorInput=e=>{if(still||!nav.hidden||e.target.closest('button:not(#memory-object):not(#letter-object):not(#book-object),a,.reading')||document.body.classList.contains('reading-active'))return;if(![0,1,2,3,4,5,6,7,8,9].includes(active))return;visitor.move(e.clientX,e.clientY,w,h);invalidate()};
listen(window,'pointermove',visitorInput,{passive:true});listen(window,'pointerdown',visitorInput,{passive:true});
listen(window,'pointerup',e=>{if(e.pointerType!=='mouse'){visitor.leave();invalidate()}},{passive:true});
listen(window,'blur',()=>{visitor.leave();setHold(false);invalidate()});
listen(window,'pointercancel',()=>{visitor.leave();invalidate()},{passive:true});listen(document.documentElement,'pointerleave',()=>{visitor.leave();invalidate()});
listen(window,'scroll',updateTarget,{passive:true});listen(window,'resize',resize,{passive:true});listen(window,'hashchange',route);
listen(narrow,'change',()=>{mobile=narrow.matches;loadVersion++;for(const name of plates.keys())if(name.endsWith('-depth'))plates.delete(name);plateLoads.clear();prepareNearby();for(const seq of sequences.values()){seq.limit=mobile?8:24;seq.evict()}resize()});
listen(reduced,'change',()=>{const fraction=p;still=reduced.matches;setupMotion();jump(fraction)});
listen(document,'visibilitychange',()=>{if(!document.hidden)invalidate();else if(raf){cancelAnimationFrame(raf);raf=0}});
listen(window,'pagehide',()=>{for(const held of endpoints.values()){held.width=held.height=1}endpoints.clear();for(const seq of sequences.values())seq.dispose();sequences.clear()});listen(window,'pageshow',e=>{if(e.persisted)setupMotion()});
listen(toggle,'click',()=>menu(nav.hidden));listen($('#chapters-close'),'click',()=>menu(false));
listen(nav,'keydown',e=>{if(e.key==='Escape')menu(false);if(e.key==='Tab'){const items=[...nav.querySelectorAll('a,button')];if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();items.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===items.at(-1)){e.preventDefault();items[0].focus()}}});
for(const a of nav.querySelectorAll('a'))listen(a,'click',e=>{e.preventDefault();menu(false);const c=narrative.find(c=>'#'+c.id===a.hash);if(c){history.replaceState(null,'',a.hash);jump(c.at)}});
listen($('#still-toggle'),'click',()=>{const fraction=p;still=!still;setupMotion();jump(fraction)});
listen($('#next-beat'),'click',()=>jump(p>.985?0:(narrative.find(c=>c.at>p+.02)?.at??1)));
const setHold=value=>{holding=value;holdButton.setAttribute('aria-pressed',String(value));letterObject.setAttribute('aria-pressed',String(value));invalidate()};
listen(letterObject,'click',()=>{letterPinned=!letterPinned;setHold(letterPinned);letterObject.setAttribute('aria-label',letterPinned?'Let the letter fold away':'Keep the letter open')});
listen(holdButton,'pointerdown',e=>{holdButton.setPointerCapture(e.pointerId);setHold(true)});listen(holdButton,'pointerup',()=>setHold(false));listen(holdButton,'pointercancel',()=>setHold(false));listen(holdButton,'lostpointercapture',()=>setHold(false));listen(holdButton,'keydown',e=>{if([' ','Enter'].includes(e.key)){e.preventDefault();setHold(true)}});listen(holdButton,'keyup',e=>{if([' ','Enter'].includes(e.key))setHold(false)});listen(holdButton,'blur',()=>setHold(false));
for(const c of chapters){const el=$('#'+c.id);el.style.top=`${c.at*100}%`}
setupMotion();prepareNearby();plate('hero-cafe');
fetch('/film-manifest.json').then(r=>r.ok?r.json():null).then(m=>{manifest=m;prepareFilms();invalidate()}).catch(()=>{});
if(location.hash)route();
if(import.meta.hot)import.meta.hot.dispose(()=>{memory.close();abort.abort();for(const seq of sequences.values())seq.dispose();if(raf)cancelAnimationFrame(raf)});
