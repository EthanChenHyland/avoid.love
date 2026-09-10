import {storyToScroll} from '../src/scroll-map.mjs';
export async function scrollToChapter(page,at){
 const geometry=await page.evaluate(()=>[document.querySelector('.scroll-track').offsetHeight-innerHeight,document.querySelector('.kept-scroll-room').offsetHeight]);
 await page.evaluate(top=>scrollTo({top,behavior:'instant'}),storyToScroll(at,...geometry));
}
