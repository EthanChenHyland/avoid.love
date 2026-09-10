import {clamp,progress,keptMotionRange} from './timeline.mjs';
export const stayScrollRange=[.966,.986];
export const keyScrollRange=[.806,.824];
// Extra physical scrolling belongs to each beat without slowing adjacent ones.
export function storyToScroll(p,range,extra,keyExtra=0,stayExtra=0){
 const base=range-extra-keyExtra-stayExtra;
 return clamp(p)*base+extra*progress(p,...keptMotionRange)+keyExtra*progress(p,...keyScrollRange)+stayExtra*progress(p,...stayScrollRange);
}
export function scrollToStory(y,range,extra,keyExtra=0,stayExtra=0){
 const base=range-extra-keyExtra-stayExtra;let offset=0;
 for(const [start,end,length] of [[...keptMotionRange,extra],[...keyScrollRange,keyExtra],[...stayScrollRange,stayExtra]]){
  const a=start*base+offset,b=end*base+offset+length;
  if(y<a)return clamp((y-offset)/base);
  if(y<=b)return start+(end-start)*progress(y,a,b);
  offset+=length;
 }
 return clamp((y-offset)/base);
}
