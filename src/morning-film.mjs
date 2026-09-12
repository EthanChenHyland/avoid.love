import {clamp,smooth} from './timeline.mjs';
import {storyToScroll} from './scroll-map.mjs';
// A single evenly lit shot across both chapters. Physical distance keeps the
// spacer boundary from accelerating it; eased endpoints join the native loop.
export function morningFilmProgress(p,geometry){
 const start=storyToScroll(.952,...geometry),end=storyToScroll(.986,...geometry);
 return smooth(clamp((storyToScroll(p,...geometry)-start)/(end-start)));
}
