import {clamp,progress,keptMotionRange} from './timeline.mjs';
export const clockScrollRange=[.205,.223],waitingScrollRange=[.34,.379],addressScrollRange=[.530,.546];
export const stayScrollRange=[.966,.986];
export const keyScrollRange=[.806,.824];
// Extra physical scrolling belongs to each beat without slowing adjacent ones.
export function storyToScroll(p,range,extra,keyExtra=0,stayExtra=0,clockExtra=0,addressExtra=0){
 const base=range-extra-keyExtra-stayExtra-clockExtra-addressExtra;
 return clamp(p)*base+extra*progress(p,...keptMotionRange)+keyExtra*progress(p,...keyScrollRange)+stayExtra*progress(p,...stayScrollRange)+clockExtra*.5*progress(p,...clockScrollRange)+clockExtra*.5*progress(p,...waitingScrollRange)+addressExtra*progress(p,...addressScrollRange);
}
export function scrollToStory(y,range,extra,keyExtra=0,stayExtra=0,clockExtra=0,addressExtra=0){
 const base=range-extra-keyExtra-stayExtra-clockExtra-addressExtra;let offset=0;
 for(const [start,end,length] of [[...clockScrollRange,clockExtra*.5],[...waitingScrollRange,clockExtra*.5],[...addressScrollRange,addressExtra],[...keptMotionRange,extra],[...keyScrollRange,keyExtra],[...stayScrollRange,stayExtra]]){
  const a=start*base+offset,b=end*base+offset+length;
  if(y<a)return clamp((y-offset)/base);
  if(y<=b)return start+(end-start)*progress(y,a,b);
  offset+=length;
 }
 return clamp((y-offset)/base);
}
