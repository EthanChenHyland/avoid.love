import test from 'node:test';import assert from 'node:assert/strict';
import {morningFilmProgress} from '../src/morning-film.mjs';import {storyToScroll,scrollToStory} from '../src/scroll-map.mjs';
test('the morning shot carries motion across the chapter boundary and settles at its endpoint',()=>{
 for(const geometry of [[51000,1700,380,1400,360,960,13600],[43000,1500,340,1260,315,840,11900]]){
  assert.equal(morningFilmProgress(.952,geometry),0);assert.equal(morningFilmProgress(.986,geometry),1);
  const start=storyToScroll(.952,...geometry),end=storyToScroll(.986,...geometry);let last=0;
  for(let i=0;i<=1000;i++){const p=scrollToStory(start+(end-start)*i/1000,...geometry),v=morningFilmProgress(p,geometry);assert.ok(v>=last-1e-10);assert.ok(v-last<.005);last=v}
  const join=storyToScroll(.966,...geometry),left=morningFilmProgress(scrollToStory(join-1,...geometry),geometry),mid=morningFilmProgress(.966,geometry),right=morningFilmProgress(scrollToStory(join+1,...geometry),geometry);
  assert.ok(mid>.1&&mid<.6);assert.ok(Math.abs((right-mid)-(mid-left))<1e-6);assert.ok(right-left<.002);
  assert.ok(morningFilmProgress(scrollToStory(start+1,...geometry),geometry)<1e-5);assert.ok(1-morningFilmProgress(scrollToStory(end-1,...geometry),geometry)<1e-5);
 }
});
