import {clamp} from './timeline.mjs';
/** Interpolate only neighboring decoded frames. Never ghost unrelated cache catch-up frames. */
export class FilmSurface {
 constructor({blendFrames=true}={}){this.blendFrames=blendFrames;this.canvas=document.createElement('canvas');this.ctx=this.canvas.getContext('2d');this.moving=false}
 sample(sequence,image,t){
 if(!image)return null;
 if(this.canvas.width!==image.width||this.canvas.height!==image.height){this.canvas.width=image.width;this.canvas.height=image.height}
 const position=clamp(t)*(sequence.count-1),low=Math.floor(position),high=Math.ceil(position),a=sequence.frames.get(low),b=sequence.frames.get(high);
 this.ctx.globalAlpha=1;this.ctx.drawImage(this.blendFrames&&a&&b?a:image,0,0);
 if(this.blendFrames&&a&&b&&high!==low){this.ctx.globalAlpha=position-low;this.ctx.drawImage(b,0,0);this.ctx.globalAlpha=1}
 return this.canvas;
 }
 dispose(){this.canvas.width=this.canvas.height=1}
}
