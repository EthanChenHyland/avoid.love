import {clamp,progress} from './timeline.mjs';
const start=.799,end=.814;
// Extra physical scrolling belongs only to the fully visible drawer chapter.
export function storyToScroll(p,range,extra){const base=range-extra;return clamp(p)*base+extra*progress(p,start,end)}
export function scrollToStory(y,range,extra){
 const base=range-extra,a=start*base,b=end*base+extra;
 if(y<a)return clamp(y/base);
 if(y>b)return clamp((y-extra)/base);
 return start+(end-start)*progress(y,a,b);
}
