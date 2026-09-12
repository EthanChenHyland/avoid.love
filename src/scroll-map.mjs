import {expansionScrollBeats,expansionScrollTotal} from './expansion.mjs';
import {clamp,progress,keptMotionRange} from './timeline.mjs';
export const clockScrollRange=[.205,.223],waitingScrollRange=[.34,.379],addressScrollRange=[.530,.546];
export const stayScrollRange=[.966,.986];
export const keyScrollRange=[.806,.824];
// Extra physical scrolling belongs to each beat without slowing adjacent ones.
export function storyToScroll(p,range,extra,keyExtra=0,stayExtra=0,clockExtra=0,addressExtra=0,expansionExtra=0){
 const base=range-extra-keyExtra-stayExtra-clockExtra-addressExtra-expansionExtra;
 return clamp(p)*base+extra*progress(p,...keptMotionRange)+keyExtra*progress(p,...keyScrollRange)+stayExtra*progress(p,...stayScrollRange)+clockExtra*.5*progress(p,...clockScrollRange)+clockExtra*.5*progress(p,...waitingScrollRange)+addressExtra*progress(p,...addressScrollRange)+expansionScrollBeats.reduce((sum,b)=>sum+expansionExtra*b.scroll[2]/expansionScrollTotal*progress(p,b.scroll[0],b.scroll[1]),0);
}
export function scrollToStory(y,range,extra,keyExtra=0,stayExtra=0,clockExtra=0,addressExtra=0,expansionExtra=0){
 const base=range-extra-keyExtra-stayExtra-clockExtra-addressExtra-expansionExtra;let offset=0;
 const segments=[[...clockScrollRange,clockExtra*.5],[...waitingScrollRange,clockExtra*.5],[...addressScrollRange,addressExtra],[...keptMotionRange,extra],[...keyScrollRange,keyExtra],[...stayScrollRange,stayExtra],...expansionScrollBeats.map(b=>[b.scroll[0],b.scroll[1],expansionExtra*b.scroll[2]/expansionScrollTotal])].sort((a,b)=>a[0]-b[0]);
 for(const [start,end,length] of segments){
  const a=start*base+offset,b=end*base+offset+length;
  if(y<a)return clamp((y-offset)/base);
  if(y<=b)return start+(end-start)*progress(y,a,b);
  offset+=length;
 }
 return clamp((y-offset)/base);
}
