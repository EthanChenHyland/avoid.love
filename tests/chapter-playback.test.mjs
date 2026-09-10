import test from 'node:test';
import assert from 'node:assert/strict';
import {keptFilmProgress} from '../src/timeline.mjs';
test('drawer motion occupies the fully visible chapter and holds during both handoffs',()=>{
 for(const p of [.75,.77,.792,.798,.799])assert.equal(keptFilmProgress(p),0);
 assert.ok(Math.abs(keptFilmProgress(.8065)-.2)<1e-12);
 assert.ok(keptFilmProgress(.7991)<.001,'Motion eases away from the first frame');
 assert.ok(1-keptFilmProgress(.8139)<.001,'Motion eases into the final frame');
 for(const p of [.814,.82,.839])assert.equal(keptFilmProgress(p),1);
 assert.ok(keptFilmProgress(.808)<.4,'Paper motion continues beyond the first sixty percent of the chapter');
 const samples=Array.from({length:101},(_,i)=>keptFilmProgress(.799+i*.015/100));
 assert.ok(samples.every((v,i)=>!i||v>=samples[i-1]),'Retime stays monotonic');
 const positions=[.799,.802,.806,.810,.814];
 assert.deepEqual(positions.map(keptFilmProgress),positions.toReversed().map(keptFilmProgress).toReversed());
});
