import {clamp} from './timeline.mjs';
import {storyToScroll} from './scroll-map.mjs';
// One shot across both chapters, timed by physical scrolling so the spacer
// boundary cannot accelerate it. Give the visible motion most of the distance.
const points=[[0,0],[.48,.35],[.82,.60],[1,1]];
const slopes=points.slice(1).map(([x,y],i)=>(y-points[i][1])/(x-points[i][0]));
const tangents=points.map((_,i)=>{if(i===0||i===points.length-1)return 0;const before=points[i][0]-points[i-1][0],after=points[i+1][0]-points[i][0],a=2*after+before,b=after+2*before;return (a+b)/(a/slopes[i-1]+b/slopes[i])});
export function morningFilmProgress(p,geometry){
 const start=storyToScroll(.952,...geometry),end=storyToScroll(.986,...geometry);
 const t=clamp((storyToScroll(p,...geometry)-start)/(end-start));let i=0;while(i<points.length-2&&t>points[i+1][0])i++;
 const [x,a]=points[i],[last,b]=points[i+1],span=last-x,u=(t-x)/span,u2=u*u,u3=u2*u;
 return clamp((2*u3-3*u2+1)*a+(u3-2*u2+u)*span*tangents[i]+(-2*u3+3*u2)*b+(u3-u2)*span*tangents[i+1]);
}
