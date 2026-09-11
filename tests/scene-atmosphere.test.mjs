import test from 'node:test';
import assert from 'node:assert/strict';
import {atmosphereState,atmosphereRanges,drawSceneAtmosphere} from '../src/scene-atmosphere.mjs';
test('atmosphere fades continuously at chapter boundaries, is reversible, and disables for still mode',()=>{
 for(const [,a,b,c,d] of atmosphereRanges){
  assert.deepEqual(atmosphereState(a),[]);assert.deepEqual(atmosphereState(d),[]);
  assert.ok(atmosphereState(a+1e-7)[0].alpha<1e-7);assert.ok(atmosphereState(d-1e-7)[0].alpha<1e-7);
  assert.equal(atmosphereState((b+c)/2)[0].alpha,1);assert.deepEqual(atmosphereState((b+c)/2,true),[]);
 }
 const forward=Array.from({length:1001},(_,i)=>atmosphereState(i/1000));
 for(let i=1000;i>=0;i--)assert.deepEqual(atmosphereState(i/1000),forward[i]);
});
test('effects balance canvas state and emit finite geometry across mobile, desktop and both directions',()=>{
 for(const [w,h] of [[320,568],[390,844],[844,390],[1280,720]]){
 let depth=0;const c=new Proxy({save(){depth++},restore(){depth--},createLinearGradient(){return {addColorStop(){}}},createRadialGradient(){return {addColorStop(){}}}},{get:(o,k)=>o[k]||((...args)=>{for(const n of args)if(typeof n==='number')assert.ok(Number.isFinite(n))}),set:()=>true});
 for(let i=0;i<=1000;i++){drawSceneAtmosphere(c,{p:i/1000,w,h,mobile:w<701,still:false,visitor:{x:-1,y:1,presence:1}});assert.equal(depth,0)}
 }
});
