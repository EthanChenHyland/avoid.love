import test from 'node:test';
import assert from 'node:assert/strict';
import {keptFilmProgress} from '../src/timeline.mjs';
test('drawer motion occupies the fully visible chapter and holds during both handoffs',()=>{
 for(const p of [.75,.77,.792,.798,.799])assert.equal(keptFilmProgress(p),0);
 assert.ok(Math.abs(keptFilmProgress(.8065)-.5)<1e-12);
 for(const p of [.814,.82,.839])assert.equal(keptFilmProgress(p),1);
 const positions=[.799,.802,.806,.810,.814];
 assert.deepEqual(positions.map(keptFilmProgress),positions.toReversed().map(keptFilmProgress).toReversed());
});
