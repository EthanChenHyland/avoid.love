import {clamp,nearestFrame} from './timeline.mjs';
/** Bounded, direction-aware frame cache. Poster remains available on network failure. */
export class FrameSequence {
 constructor({base,count,limit=24,onReady=()=>{}}){
  Object.assign(this,{base,count,limit,onReady});this.frames=new Map();this.pending=new Map();this.failed=new Set();this.target=0;this.dead=false;this.drawn=-1;
 }
 request(index){
  index=Math.round(clamp(index,0,this.count-1));this.target=index;
  const order=[index,index+1,index-1,index+2,index-2,index+4,index-4];
  for(const i of order){if(i<0||i>=this.count||this.frames.has(i)||this.pending.has(i)||this.failed.has(i)||this.pending.size>=4)continue;
   const controller=new AbortController();this.pending.set(i,controller);
   fetch(`${this.base}/${String(i).padStart(3,'0')}.webp`,{signal:controller.signal})
    .then(r=>{if(!r.ok)throw Error('Frame unavailable');return r.blob()})
    .then(b=>createImageBitmap(b))
    .then(frame=>{if(this.dead){frame.close();return}this.frames.set(i,frame);this.evict();this.onReady()})
    .catch(e=>{if(e.name!=='AbortError')this.failed.add(i)})
    .finally(()=>{this.pending.delete(i);if(!this.dead&&!this.frames.has(this.target)&&!this.failed.has(this.target))this.request(this.target)});
  }
 }
 get(t){const i=Math.round(clamp(t)*(this.count-1));this.request(i);const key=nearestFrame(this.frames.keys(),i);this.drawn=key??-1;return key===null?null:this.frames.get(key)}
 evict(){while(this.frames.size>this.limit){const key=[...this.frames.keys()].sort((a,b)=>Math.abs(b-this.target)-Math.abs(a-this.target))[0];this.frames.get(key).close();this.frames.delete(key)}}
 dispose(){this.dead=true;for(const c of this.pending.values())c.abort();for(const f of this.frames.values())f.close();this.frames.clear();this.pending.clear()}
}
