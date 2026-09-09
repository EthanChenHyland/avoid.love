import {clamp} from './timeline.mjs';
/** The physical page is optional direct input; untouched books still follow the story. */
export function bookInput({state,wake,signal}){
 const el=document.querySelector('#book-object');let grabbed=null,value=null,target=null,active=false;
 const on=(type,fn)=>el.addEventListener(type,fn,{signal});
 on('pointerdown',e=>{if(!active)return;grabbed={x:e.clientX,y:e.clientY,start:value??state().turn};el.setPointerCapture(e.pointerId)});
 on('pointermove',e=>{if(!grabbed)return;const dx=e.clientX-grabbed.x,dy=e.clientY-grabbed.y;if(Math.abs(dy)>Math.abs(dx)+12){grabbed=null;return}if(Math.abs(dx)>7){target=clamp(grabbed.start-dx/Math.max(100,el.clientWidth*.65));if(value===null)value=grabbed.start;wake()}});
 on('pointerup',e=>{if(grabbed&&target!==null){target=target>.5?1:0;wake()}grabbed=null;if(el.hasPointerCapture(e.pointerId))el.releasePointerCapture(e.pointerId)});
 on('lostpointercapture',()=>{grabbed=null});
 on('pointercancel',()=>{grabbed=null;target=null;value=null;wake()});
 on('keydown',e=>{if(['ArrowLeft','ArrowRight','Enter',' '].includes(e.key)){e.preventDefault();value??=state().turn;target=e.key==='ArrowLeft'?1:e.key==='ArrowRight'?0:value>.5?0:1;wake()}});
 return {get moving(){return value!==null&&target!==null&&Math.abs(value-target)>.001},get turn(){if(value!==null&&target!==null){value+=(target-value)*.22;if(Math.abs(value-target)<.001)value=target}return value},update(bounds){active=!!bounds;el.hidden=!active;if(!active){value=target=null;grabbed=null;return}Object.assign(el.style,{left:bounds.x+'px',top:bounds.y+'px',width:bounds.w+'px',height:bounds.h+'px'});el.setAttribute('aria-pressed',String((value??state().turn)>.5))}};
}
