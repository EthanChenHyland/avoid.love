# Pear — current-site engineering and visual study

Live site visited 2026-09-06 at 1280×720, then 390×844. Browser screenshots inspected during scroll. The live page, not memory, grounds the observations. Repository work is a secondary technical source and does not prove original authorship of its additions.

## Experience storyboard
1. Blue theater, classical figure opening curtain, marble foreground. Restrained serif copy on left. Fabric is a physical reveal and a framing device.
2. Scroll pushes past massive diagonal architectural surface. The previous full-frame art becomes an extreme crop, hiding the chapter cut. Headline appears during a calmer interval.
3. Gold fruit in a figure's hand, tree canopy overhead. Face/hand/fruit/leaf layers create convincing scale and eye direction; typography yields to the illustration.
4. Scaffolding and figures moving materials: a whole new composition with the same palette and figure language. Vertical ropes guide eye/camera movement.
5. Plan view on light paper. Architecture becomes a drawn object; camera orientation and material change together.
6. Figure with floating gold fruit against sky. A persistent motif carries continuity through large scale shifts.
7. Golden fruit tree frames a deep-blue central void; the void becomes room for the questions/late narrative.
8. Paired figures and tree resolve into branded final composition and application. Multiple layers overlap during transition; a pause produces the intended stable frame.

The method: art first → stable framing → movement along a meaningful object → brief typography hold → object/environment match cut → different spatial world. The reference is not an instruction to use classical figures, blue, pears, curtain layouts, ruler UI, or exact timings.

## Observed live technical surface
- At 1280×720: document height 38,520px, about 53.5 viewport heights. Multiple canvases; main displayed backing canvas 2560×1440 (2× DPR).
- Live DOM includes `/films/footer-loop.mp4` and `/films/reveal.mp4`; substantial visuals rendered in canvas rather than accessible images.
- Live script name at inspection matches cloned bundle name `index-BhJdAf8K.js`; deeper conclusions below refer to inspected bundled code, not a hand-authored source tree.
- A 390px reload visibly shows a blurred poster and percentage loader before sharp artwork; mobile restacks copy but the large figure crosses behind small white text. At an early scroll sample the figure was mostly cropped to the right. V4 should author crops, shorten holds, and keep key objects away from text.

## Bundle inspection
- No literal ScrollTrigger or Three WebGLRenderer usage in the inspected narrative code. Raw WebGL uniforms/textures, one requestAnimationFrame loop and normalized thresholds.
- Frame groups inspected: `tree` 121 frames, `plan` 121, `trans` 121, `coda` 89, `flysky` 121 (directories also contain mobile subdirectory, so filesystem item counts are one higher).
- Sequence loader chooses `/768` at max-width 820px. It orders frames progressively and assigns scroll-range priorities. This is stronger than downloading every frame sequentially.
- WebGL texture uploads use texSubImage2D when possible. Draws check changes before repeated uploads. Video currentTime is sampled for texture updates; ordinary video seeking is not the sole animation strategy.
- DPR capped at 2 desktop / 1.5 narrow screens. Adaptive resolution decreases after slow frames and slowly recovers. Reduced-motion and coarse-pointer flags are present.

## Reconstruction-specific delivery work
`public/preload.js`, `public/sw.js`, `scripts/build-frame-packs.mjs` rebuild delivery. Critical packs contain every eighth frame; detail packs fill gaps. Six concurrent critical workers, three detail workers. Versioned caches separate desktop/mobile, service worker slices packed blobs into individual WebP responses. Failures fall back to direct assets. Do not misattribute this separate reconstruction pipeline to Pear's original authors.

## V4 tests to derive
- Bounded sparse-first frame cache with nearest-ready fallback and reverse traversal.
- Original asset match cut: macro petal covers camera, shrinks into a café flower.
- Keep a visible poster until critical art is decoded; do not block all reading behind progress.
- Native scroll, interpolated visual state, no input cancellation.
- Render when dirty, cap DPR, release frames, respect reduced-motion.
- Desktop type can pass behind a real foreground mask. Mobile type gets its own low-conflict area.

## License
No top-level LICENSE in public reconstruction; README attributes concept/art/branding/copy/media to respective owners. No code, font, artwork or film is reused in V4.
