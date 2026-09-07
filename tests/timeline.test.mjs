import test from 'node:test';
import assert from 'node:assert/strict';
import {cover,firstAct,nearestFrame,clamp,motionScale} from '../src/timeline.mjs';
import {FrameSequence} from '../src/sequence.mjs';
test('cover fills both portrait and landscape viewports without exposed edges',()=>{for(const [w,h] of [[390,844],[1280,720],[1920,1080],[844,390]]){const b=cover(1536,864,w,h);assert.ok(b.w>=w&&b.h>=h);assert.ok(b.x<=0&&b.y<=0)}});
test('film progress is monotonic, clamped and reversible at every checkpoint',()=>{let prev=0;for(let i=0;i<=100;i++){const s=firstAct(i/100);assert.ok(s.film>=prev);assert.ok(s.film<=1);prev=s.film}assert.equal(firstAct(0).hero,1);assert.equal(firstAct(1).cafe,1);const forward=Array.from({length:101},(_,i)=>firstAct(i/100).film);const backward=Array.from({length:101},(_,i)=>firstAct((100-i)/100).film);assert.deepEqual(backward,forward.toReversed());assert.equal(clamp(-1),0)});
test('missing frame selects nearest ready neighbor, including reverse travel',()=>{assert.equal(nearestFrame([0,8,16,24],14),16);assert.equal(nearestFrame([0,8,16,24],9),8);assert.equal(nearestFrame([],4),null)});
test('cache closes distant bitmaps and disposes remaining GPU resources',()=>{const s=new FrameSequence({base:'',count:120,limit:3});let closed=0;s.target=9;for(const i of [0,4,8,9,10])s.frames.set(i,{close(){closed++}});s.evict();assert.equal(s.frames.size,3);assert.deepEqual([...s.frames.keys()],[8,9,10]);assert.equal(closed,2);s.dispose();assert.equal(closed,5);assert.equal(s.frames.size,0)});

test('translated depth plates cover every edge at narrow, intermediate and landscape sizes',()=>{
 for(const [w,h] of [[320,568],[390,844],[700,900],[701,900],[768,1024],[844,390]])for(const [iw,ih] of [[864,1536],[1536,864]])for(const dx of [-21,0,21])for(const dy of [-15,0,15]){
 const b=cover(iw,ih,w,h,.5,motionScale(w,h,1.012,dx,dy));assert.ok(b.x+dx<=0&&b.y+dy<=0&&b.x+dx+b.w>=w&&b.y+dy+b.h>=h,`${w}x${h}: ${dx},${dy}`);
 }
});
