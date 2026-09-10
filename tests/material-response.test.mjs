import test from 'node:test';
import assert from 'node:assert/strict';
import {materialResponse} from '../src/material-response.mjs';
test('tactile responses are passive, bounded, settle, and clear for reduced motion',t=>{
 const handlers={},options={},oldWindow=globalThis.window,oldDocument=globalThis.document;
 let now=100,p=.803,still=false,wakes=0;
 globalThis.window={addEventListener(name,fn,opts){handlers[name]=fn;options[name]=opts}};
 globalThis.document={querySelector:()=>({hidden:true})};t.mock.method(performance,'now',()=>now);
 try{
  const motion=materialResponse({state:()=>({p,w:100,h:100,still}),wake:()=>wakes++});
  const event={clientX:80,clientY:72,target:{closest:()=>null}};
  handlers.pointerdown(event);assert.equal(options.pointerdown.passive,true);assert.ok(wakes);
  for(let i=0;i<8;i++){now+=16;motion.update()}assert.ok(Math.abs(motion.key)>0);assert.ok(Math.abs(motion.key)<=.35);
  for(let i=0;i<400;i++){now+=16;motion.update()}assert.equal(motion.moving,false);
  p=.736;handlers.pointermove(event);motion.update();assert.ok(motion.moving);assert.notEqual(motion.thread(.72,.4),0);
  still=true;motion.update();assert.equal(motion.moving,false);assert.equal(motion.thread(.72,.4),0);assert.equal(motion.key,0);
 }finally{globalThis.window=oldWindow;globalThis.document=oldDocument}
});
