export const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
export const progress=(n,a,b)=>clamp((n-a)/(b-a));
export const smooth=n=>{n=clamp(n);return n*n*(3-2*n)};
export const mix=(a,b,t)=>a+(b-a)*t;
export function cover(iw,ih,w,h,focus=.5,scale=1){
 const s=Math.max(w/iw,h/ih)*scale;
 return {x:(w-iw*s)*focus,y:(h-ih*s)*.5,w:iw*s,h:ih*s};
}
export function firstAct(p){
 return {hero:1-smooth(progress(p,.26,.38)),handoff:smooth(progress(p,.29,.305)),film:progress(p,.305,.74),cafe:smooth(progress(p,.73,.83)),hold:progress(p,.81,1)};
}
export function nearestFrame(keys,target){
 let best=null,dist=Infinity;
 for(const k of keys){const d=Math.abs(k-target);if(d<dist){best=k;dist=d}}
 return best;
}

// Centered cover must retain enough overscan for the entire translated viewport.
export function motionScale(w,h,scale,dx,dy){return Math.max(scale,1+2*Math.max((Math.abs(dx)+1)/w,(Math.abs(dy)+1)/h))}
