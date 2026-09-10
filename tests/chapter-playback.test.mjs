import test from 'node:test';
import assert from 'node:assert/strict';
import {ChapterPlayback} from '../src/chapter-playback.mjs';
test('chapter playback waits for visible decoded footage, runs without scrolling, and retains handoff frames',()=>{
 const film=new ChapterPlayback(),state={inside:true,visible:false,enabled:true,ready:true};
 film.step(1000,state);assert.equal(film.value,0);
 state.visible=true;state.ready=false;film.step(1000,state);assert.equal(film.value,0);
 state.ready=true;film.step(3000,state);assert.equal(film.value,.5);
 state.visible=false;film.step(1000,state);assert.equal(film.value,.5);assert.equal(film.moving,false);
 state.visible=true;film.step(4000,state);assert.equal(film.value,1);film.step(16,state);assert.equal(film.moving,false);
 state.inside=false;film.step(16,state);assert.equal(film.value,0);
 state.inside=true;state.enabled=false;film.step(1000,state);assert.equal(film.value,0);
});
