/** A chapter's film advances in visible time, retaining its frame during handoffs. */
export class ChapterPlayback {
 constructor(duration=6000){this.duration=duration;this.elapsed=0;this.moving=false}
 get value(){return this.elapsed/this.duration}
 step(dt,{inside,visible,enabled,ready}){
  if(!inside||!enabled){this.elapsed=0;this.moving=false;return}
  this.moving=visible&&ready&&this.elapsed<this.duration;
  if(this.moving)this.elapsed=Math.min(this.duration,this.elapsed+dt);
 }
}
