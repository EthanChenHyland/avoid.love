export const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
export const progress=(n,a,b)=>clamp((n-a)/(b-a));
export const smooth=n=>{n=clamp(n);return n*n*(3-2*n)};
export const mix=(a,b,t)=>a+(b-a)*t;
export function cover(iw,ih,w,h,focus=.5,scale=1){
 const s=Math.max(w/iw,h/ih)*scale;
 return {x:(w-iw*s)*focus,y:(h-ih*s)*.5,w:iw*s,h:ih*s};
}
export function firstAct(p){
 return {hero:1-smooth(progress(p,.26,.38)),film:progress(p,.29,.74),cafe:smooth(progress(p,.73,.83)),hold:progress(p,.81,1)};
}
export function nearestFrame(keys,target){
 let best=null,dist=Infinity;
 for(const k of keys){const d=Math.abs(k-target);if(d<dist){best=k;dist=d}}
 return best;
}
