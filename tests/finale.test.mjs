import test from 'node:test';
import assert from 'node:assert/strict';
import {finale,finalePhase,finalePoint,finaleDuration} from '../src/finale.mjs';
import {storyToScroll,scrollToStory} from '../src/scroll-map.mjs';
import {expansionBeats,expansionScrollTotal} from '../src/expansion.mjs';
test('finale repeats continuously with stationary cycle boundaries and matching geometry',()=>{
 for(const time of [0,100,2300,4600,5600,8000,10600,10999])assert.equal(finalePhase(time),finalePhase(time+finaleDuration));
 assert.equal(finalePhase(0),0);assert.equal(finalePhase(11000),0);
 for(const boundary of [4600,6000,10600,11000])for(let i=0;i<200;i++){
  const a=finalePoint(i,200,finalePhase(boundary-.01),390,844),b=finalePoint(i,200,finalePhase(boundary+.01),390,844);
  assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<.001);
 }
});
test('finale continues beyond its first cycle, pauses outside the ending and respects reduced motion',()=>{
 let now=100,state={p:1,w:390,h:844,mobile:true,still:false,visitor:{x:0,y:0,presence:0}};
 const c=new Proxy({},{get:()=>()=>{},set:()=>true}),f=finale({state:()=>state,clock:()=>now});
 for(let n=0;n<800;n++){now+=32;f.draw(c)}assert.equal(f.moving,true);
 state.p=.992;f.draw(c);assert.equal(f.moving,false);
 state.p=1;f.draw(c);assert.equal(f.moving,true);
 state.still=true;f.draw(c);assert.equal(f.moving,false);
 state.still=false;state.p=.98;f.draw(c);assert.equal(f.moving,false);
});
test('five chapter extensions preserve round trips and original drawer timing',()=>{
 assert.equal(expansionBeats.length,5);assert.equal(expansionScrollTotal,650);
 const prior=[30000,1700,440,1400,360,960],next=[35200,...prior.slice(1),5200];
 for(let i=0;i<=1000;i++){const p=i/1000;assert.ok(Math.abs(scrollToStory(storyToScroll(p,...next),...next)-p)<1e-9)}
 const delta=args=>storyToScroll(.804,...args)-storyToScroll(.789,...args);assert.ok(Math.abs(delta(prior)-delta(next))<1e-8);
});
