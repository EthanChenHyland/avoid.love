import test from 'node:test';
import assert from 'node:assert/strict';
import {keptFilmProgress} from '../src/timeline.mjs';
test('drawer motion occupies the fully visible chapter and holds during both handoffs',()=>{
 for(const p of [.75,.77,.782,.788,.789])assert.equal(keptFilmProgress(p),0);
 for(const [portion,frame] of [[.16,8],[.48,25],[.82,36]])assert.ok(Math.abs(keptFilmProgress(.789+portion*.015)-frame/90)<1e-10);
 for(const portion of [.16,.48,.82]){const p=.789+portion*.015,e=1e-7;const left=(keptFilmProgress(p)-keptFilmProgress(p-e))/e,right=(keptFilmProgress(p+e)-keptFilmProgress(p))/e;assert.ok(Math.abs(left-right)<.1,'Speed stays continuous at opening/closing joins')}
 assert.ok(keptFilmProgress(.7891)<.004,'Motion eases away from the first frame');
 assert.ok(1-keptFilmProgress(.8039)<.004,'Motion eases into the final frame');
 for(const p of [.804,.82,.839])assert.equal(keptFilmProgress(p),1);
 assert.ok(keptFilmProgress(.798)<.4,'Paper motion continues beyond the first sixty percent of the chapter');
 const samples=Array.from({length:101},(_,i)=>keptFilmProgress(.789+i*.015/100));
 assert.ok(samples.every((v,i)=>!i||v>=samples[i-1]),'Retime stays monotonic');
 const positions=[.789,.792,.796,.800,.804];
 assert.deepEqual(positions.map(keptFilmProgress),positions.toReversed().map(keptFilmProgress).toReversed());
});
