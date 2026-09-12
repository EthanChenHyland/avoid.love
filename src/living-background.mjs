/** One decoded native film beneath the canvas effects; never a second frame cache. */
export function livingBackground({state,wake,signal}){
 const video=document.createElement('video');video.id='living-background';video.muted=true;video.defaultMuted=true;video.loop=true;video.playsInline=true;video.preload='auto';
 video.setAttribute('muted','');video.setAttribute('playsinline','');video.setAttribute('aria-hidden','true');video.tabIndex=-1;
 Object.assign(video.style,{position:'fixed',width:'1px',height:'1px',opacity:'0',pointerEvents:'none',bottom:'0',left:'0'});document.body.append(video);
 let source='',wanted=false,pending=false,blocked=false,failed=false,presented=false,frameRequest=null;
 const awaitFrame=()=>{presented=false;if(video.requestVideoFrameCallback){if(frameRequest!==null)video.cancelVideoFrameCallback?.(frameRequest);frameRequest=video.requestVideoFrameCallback(()=>{frameRequest=null;presented=true;wake()})}};
 video.addEventListener('seeking',awaitFrame,{signal});
 video.addEventListener('timeupdate',()=>{if(!video.requestVideoFrameCallback&&video.currentTime>0&&video.readyState>=2){presented=true;wake()}},{signal});
 const pause=()=>{wanted=false;video.pause()};
 const play=()=>{if(!wanted||pending||blocked||failed||!video.paused)return;pending=true;video.play().catch(()=>{blocked=true}).finally(()=>{pending=false;if(!wanted)video.pause();wake()})};
 video.addEventListener('loadeddata',()=>{awaitFrame();wake()},{signal});video.addEventListener('error',()=>{failed=true;pause();wake()},{signal});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else wake()},{signal});
 window.addEventListener('pointerdown',()=>{if(blocked){blocked=false;play()}},{signal,passive:true});
 window.addEventListener('pagehide',()=>{pause();if(frameRequest!==null){video.cancelVideoFrameCallback?.(frameRequest);frameRequest=null}video.removeAttribute('src');video.load();source='';failed=false;presented=false},{signal});
 return {get moving(){return wanted&&!failed&&!blocked&&!video.paused},get time(){return video.currentTime},get status(){return failed?'unavailable':blocked?'blocked':wanted?'playing':'paused'},sample(){
  const {p,still,mobile,obscured}=state();
  const active=!still&&!obscured&&!document.hidden&&p>.988;
  if(!active)pause();
  if(!still&&p>=.97&&!source){source=`/films/morning-steady-loop${mobile?'-mobile':''}.mp4`;video.src=source;video.load()}
  if(!active){if(p<.988&&video.readyState>=1&&video.currentTime)video.currentTime=0;return null}
  wanted=true;play();
  if(!presented||video.readyState<2||video.seeking||failed||blocked)return null;
  video.width=video.videoWidth;video.height=video.videoHeight;return video;
 }};
}
