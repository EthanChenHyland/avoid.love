import test from 'node:test';import assert from 'node:assert/strict';
import {newChapters,drawNewChapters} from '../src/three-chapters.mjs';import {expansionBeats,expansionScrollTotal} from '../src/expansion.mjs';import {storyToScroll,scrollToStory} from '../src/scroll-map.mjs';import {narrative} from '../src/story.mjs';
test('28 unique chapters include three isolated new scroll intervals without changing the older allocations',()=>{
 assert.equal(narrative.length,28);assert.equal(new Set(narrative.map(b=>b.id)).size,28);assert.equal(expansionScrollTotal,1700);
 const ordered=[...expansionBeats].sort((a,b)=>a.scroll[0]-b.scroll[0]);for(let i=1;i<ordered.length;i++)assert.ok(ordered[i-1].scroll[1]<=ordered[i].scroll[0]);
 const args=[50000,1700,440,1400,360,960,13600],base=50000-1700-440-1400-360-960-13600;
 for(const beat of expansionBeats){const [a,b,weight]=beat.scroll;assert.ok(Math.abs(storyToScroll(b,...args)-storyToScroll(a,...args)-((b-a)*base+weight*8))<1e-8);assert.ok(Math.abs(scrollToStory(storyToScroll(beat.at,...args),...args)-beat.at)<1e-9)}
});
test('new chapter effects preserve canvas state, finite geometry, and static paper in still mode',()=>{
 for(const [w,h] of [[320,568],[390,844],[844,390],[1280,720]])for(const still of [false,true]){
 let depth=0;const c=new Proxy({save(){depth++},restore(){depth--},createRadialGradient(){return {addColorStop(){}}}},{get:(o,k)=>o[k]||((...args)=>{for(const n of args)if(typeof n==='number')assert.ok(Number.isFinite(n))}),set:()=>true});
 for(const b of newChapters)for(let i=0;i<=20;i++){drawNewChapters(c,{p:b.range[0]+(b.range[3]-b.range[0])*i/20,w,h,mobile:w<701,still,visitor:{x:1,presence:1},plates:new Map()});assert.equal(depth,0)}
 }
});
