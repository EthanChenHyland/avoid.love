import test from 'node:test';import assert from 'node:assert/strict';
import {drawChapterProcession,processions} from '../src/chapter-procession.mjs';
test('processions retrace identical geometry backwards and leave no canvas state behind',()=>{
 for(const [w,h] of [[320,568],[844,390],[1280,720]]){
  let depth=0,commands=[];const c=new Proxy({save(){depth++},restore(){depth--}},{get:(o,k)=>o[k]||((...args)=>{args.forEach(n=>{if(typeof n==='number')assert.ok(Number.isFinite(n))});commands.push([k,...args])}),set:(o,k,v)=>{commands.push([k,v]);o[k]=v;return true}});
  const sample=(p,still=false)=>{commands=[];drawChapterProcession(c,{p,w,h,mobile:w<701,still,visitor:{x:.5,presence:1}});assert.equal(depth,0);return commands};
  for(const [,a,b] of processions){assert.deepEqual(sample(a),[]);assert.deepEqual(sample(b),[]);assert.deepEqual(sample((a+b)/2,true),[]);const positions=Array.from({length:21},(_,i)=>a+(b-a)*i/20),forward=positions.map(p=>sample(p));for(let i=20;i>=0;i--)assert.deepEqual(sample(positions[i]),forward[i])}
 }
});
