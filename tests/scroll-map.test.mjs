import test from 'node:test';
import assert from 'node:assert/strict';
import {storyToScroll,scrollToStory} from '../src/scroll-map.mjs';
test('extra scrolling lengthens only the visible drawer and round trips through navigation and resizing',()=>{
 for(const [range,extra] of [[24476,1688],[28080,1440]]){
  for(let i=0;i<=1000;i++){const p=i/1000;assert.ok(Math.abs(scrollToStory(storyToScroll(p,range,extra),range,extra)-p)<1e-12)}
  const span=(a,b)=>storyToScroll(b,range,extra)-storyToScroll(a,range,extra);
  assert.ok(Math.abs(span(.789,.804)-(.015*(range-extra)+extra))<1e-8);
  assert.ok(Math.abs(span(.1,.2)-.1*(range-extra))<1e-8);
  assert.ok(Math.abs(span(.85,.95)-.1*(range-extra))<1e-8);
 }
});
test('key extension leaves envelope speed and every other chapter unchanged',()=>{
 const base=22788,extra=1772,keyExtra=127,range=base+extra+keyExtra;
 const at=p=>storyToScroll(p,range,extra,keyExtra);
 assert.ok(Math.abs(at(.804)-at(.789)-(base*.015+extra))<1e-8);
 assert.ok(Math.abs(at(.824)-at(.806)-(base*.018+keyExtra))<1e-8);
 for(let i=0;i<=1000;i++){const p=i/1000;assert.ok(Math.abs(scrollToStory(at(p),range,extra,keyExtra)-p)<1e-12)}
});
test('the expanded key is exactly 1.5 times its old full interval and the new chapter maps reversibly',()=>{
 for(const h of [720,844]){
  const base=37*h,extra=2.1*h,oldKey=.15*h,keyExtra=1.5*(base*.018+oldKey)-base*.018,stayExtra=1.8*h,range=base+extra+keyExtra+stayExtra;
  const at=p=>storyToScroll(p,range,extra,keyExtra,stayExtra);
  assert.ok(Math.abs((at(.824)-at(.806))/(base*.018+oldKey)-1.5)<1e-10);
  for(let i=0;i<=1000;i++){const p=i/1000;assert.ok(Math.abs(scrollToStory(at(p),range,extra,keyExtra,stayExtra)-p)<1e-12)}
 }
});
test('clock and address extensions round trip without changing the envelope interval',()=>{
 const geometry=[33000,1772,410,1519,380,1013];
 for(let i=0;i<=1000;i++){const p=i/1000;assert.ok(Math.abs(scrollToStory(storyToScroll(p,...geometry),...geometry)-p)<1e-12)}
});
