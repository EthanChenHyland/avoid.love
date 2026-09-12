import test from 'node:test';
import assert from 'node:assert/strict';
import {livingBackground} from '../src/living-background.mjs';
test('background warms lazily, plays only in the ending, pauses for overlays and resets away from it',async()=>{
 const original={document:globalThis.document,window:globalThis.window};let state={p:0,mobile:true,still:false,obscured:false},loads=0,frame=null;const listeners={};
 const video={style:{},readyState:2,videoWidth:640,videoHeight:360,paused:true,currentTime:0,setAttribute(){},addEventListener(name,fn){listeners[name]=fn},requestVideoFrameCallback(fn){frame=fn;return 1},cancelVideoFrameCallback(){},removeAttribute(){},load(){loads++;listeners.loadeddata?.()},pause(){this.paused=true},play(){this.paused=false;return Promise.resolve()}};
 globalThis.document={createElement:()=>video,body:{append(){}},addEventListener(){},hidden:false};globalThis.window={addEventListener(){}};
 try{
  const bg=livingBackground({state:()=>state,wake(){},signal:new AbortController().signal});assert.equal(bg.sample(),null);assert.equal(loads,0);
  state.p=.98;bg.sample();assert.equal(loads,1);assert.match(video.src,/-mobile.mp4$/);assert.equal(video.paused,true);
  state.p=1;assert.equal(bg.sample(),null);frame();assert.equal(bg.sample(),video);await Promise.resolve();await Promise.resolve();assert.equal(video.muted,true);assert.equal(video.loop,true);assert.equal(bg.moving,true);
  state.obscured=true;bg.sample();assert.equal(video.paused,true);
  state.obscured=false;state.still=true;bg.sample();assert.equal(video.paused,true);
  state.still=false;state.p=.98;video.currentTime=8;bg.sample();assert.equal(video.currentTime,0);assert.equal(bg.moving,false);
 }finally{Object.assign(globalThis,original)}
});
