export const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
export const progress=(n,a,b)=>clamp((n-a)/(b-a));
export const smooth=n=>{n=clamp(n);return n*n*(3-2*n)};
export const mix=(a,b,t)=>a+(b-a)*t;
export function cover(iw,ih,w,h,focus=.5,scale=1){
 const s=Math.max(w/iw,h/ih)*scale;
 return {x:(w-iw*s)*focus,y:(h-ih*s)*.5,w:iw*s,h:ih*s};
}
export function firstAct(p){
 return {opening:Math.sin(Math.PI*smooth(progress(p,0,.29)))**2,hero:1-smooth(progress(p,.26,.38)),handoff:p>.29?1:0,film:progress(p,.29,.74),cafe:smooth(progress(p,.73,.83)),hold:progress(p,.81,1)};
}
export function nearestFrame(keys,target){
 let best=null,dist=Infinity;
 for(const k of keys){const d=Math.abs(k-target);if(d<dist){best=k;dist=d}}
 return best;
}

// Centered cover must retain enough overscan for the entire translated viewport.
export function motionScale(w,h,scale,dx,dy){return Math.max(scale,1+2*Math.max((Math.abs(dx)+1)/w,(Math.abs(dy)+1)/h))}

// Play only under the fully visible What stayed copy (.789–.804).
// Entry and exit retain the corresponding endpoint; there is no timed playback.
// The paper movement occupies the early part of the source clip. Give that
// movement more of the chapter and compress the mostly stationary tail.
// Source frames 8–25 open the paper; 25–36 close it. Reserve substantially
// more scroll for closing and a little more for opening, borrowing from holds.
export const keptMotionRange=[.789,.804];
const keptTiming=[[0,0],[.16,8/90],[.48,25/90],[.82,36/90],[1,1]];
const keptSlopes=keptTiming.slice(1).map(([x,y],i)=>(y-keptTiming[i][1])/(x-keptTiming[i][0]));
const keptTangents=keptTiming.map((_,i)=>{
 if(i===0||i===keptTiming.length-1)return 0;
 const before=keptTiming[i][0]-keptTiming[i-1][0],after=keptTiming[i+1][0]-keptTiming[i][0];
 const a=2*after+before,b=after+2*before;
 return (a+b)/(a/keptSlopes[i-1]+b/keptSlopes[i]);
});
export function keptFilmProgress(p){
 const t=progress(p,...keptMotionRange);let i=0;while(i<keptTiming.length-2&&t>keptTiming[i+1][0])i++;
 const [x,a]=keptTiming[i],[end,b]=keptTiming[i+1],span=end-x,u=(t-x)/span,u2=u*u,u3=u2*u;
 return clamp((2*u3-3*u2+1)*a+(u3-2*u2+u)*span*keptTangents[i]+(-2*u3+3*u2)*b+(u3-u2)*span*keptTangents[i+1]);
}

export const keyTurn=p=>Math.PI*2*smooth(progress(p,.804,.820));
