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
