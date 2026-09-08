import {clamp,smooth} from './timeline.mjs';
/** Interpolate neighboring film frames and dissolve cache catch-up on a stable surface. */
export class FilmSurface {
 constructor(){this.canvas=document.createElement('canvas');this.previous=document.createElement('canvas');this.ctx=this.canvas.getContext('2d');this.old=this.previous.getContext('2d');this.key=null;this.started=-Infinity;this.moving=false}
 sample(sequence,image,t,now=performance.now()){
 if(!image)return null;const key=sequence.drawn;
 if(this.canvas.width!==image.width||this.canvas.height!==image.height){this.canvas.width=this.previous.width=image.width;this.canvas.height=this.previous.height=image.height;this.key=null}
 if(this.key!==null&&Math.abs(key-this.key)>2){this.old.clearRect(0,0,this.previous.width,this.previous.height);this.old.drawImage(this.canvas,0,0);this.started=now}
 this.key=key;const position=clamp(t)*(sequence.count-1),low=Math.floor(position),high=Math.ceil(position),a=sequence.frames.get(low),b=sequence.frames.get(high);
 this.ctx.globalAlpha=1;this.ctx.drawImage(a&&b?a:image,0,0);
 if(a&&b&&high!==low){this.ctx.globalAlpha=position-low;this.ctx.drawImage(b,0,0);this.ctx.globalAlpha=1}
 const blend=smooth(clamp((now-this.started)/140));this.moving=blend<1;
 if(this.moving){this.ctx.globalAlpha=1-blend;this.ctx.drawImage(this.previous,0,0);this.ctx.globalAlpha=1}
 return this.canvas;
 }
 dispose(){this.canvas.width=this.previous.width=1;this.canvas.height=this.previous.height=1}
}
