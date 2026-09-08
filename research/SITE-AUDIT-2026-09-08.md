# V4 whole-site continuity and expansion audit

The story now has 13 navigable chapters. The original six films, their frame assets, and the core story remain intact. New beats are After hours, The detour, and Let the light in.

## Findings and corrections

| Passage | Finding | Result |
| --- | --- | --- |
| Before → café | Earlier edits had already removed a crop reset by returning to the shared source frame. | Retained that framing match and the opaque opening. Rechecked both directions and delayed loading. |
| Café → Little things | The outgoing film must remain visible until the tabletop image decodes. | Retained decoded endpoint protection; delayed-image pixel check passes. |
| Little things → Waiting | The transition wipe was continuous; the fog overlay independently selected an inconsistent crop above 700px. | Fog now samples the same continuously varying focal position as the film. |
| Waiting → Almost | Existing feathered wipe remains continuous. Large scroll jumps could invoke a separate catch-up dissolve. | Removed catch-up ghosting globally; only neighboring frames interpolate. |
| Almost → Us | Existing wipe and film fallback remain. | Verified forward/reverse, reduced motion, letter activation and loading failures. |
| Us → The detour → Your side | The iris/window transitions produce measurable changes while their edges move; these are authored scene transitions, not a one-frame crop reset. | Retained those transitions. Added a drawn route and exclusive copy intervals for the detour. |
| Your side → Put it away | Split-seat composition is limited continuously by aspect ratio. | Verified at narrow, breakpoint and desktop sizes. |
| Put it away → Everywhere | Very large animated photos dominated the screen; a poster-to-film dissolve subsequently double-exposed mismatched crops. | Replaced full-screen photo scaling with a physical edge gallery. The scene now uses its actual film frame from entry, holding frame zero until the camera move begins. |
| Everywhere → Let the light in → Love | The movie endpoint was already retained; a header background changed at a fixed threshold. | Retained the real endpoint and made the header shade continuous. Added softly feathered window projections. |
| Heading entrances | New vertical word motion could overlap captions at intermediate widths and short landscape. | Removed the downward displacement, retaining rolling word reveals and gentle pointer response. |

## Added scene behavior

- After hours: an oversized winding clock over the held café film.
- The detour: a perspective street grid and a red route that draws through the memory.
- Everywhere: an orbital photo arrangement, projected with rotation and foreshortening; original frame imagery remains behind it.
- Let the light in: softened window beams over the original moving ending film.
- Eleven headings receive scroll-driven rolling word reveals.
- Pointer movement leaves a bounded, fading ribbon and influences the scene objects.
- Existing automatic petals, receipts, photograph flips/swipes, fog clearing, rain, steam, ripples, ink, envelopes and sunlight remain.
- New chapters appear in navigation, keyboard routing, the reading version and the no-JavaScript fallback. Pacing increases to 34 desktop / 24 mobile viewport heights.

## Evidence

- Production build and 10 Node tests pass.
- Boundary audit: 30 checkpoints × four viewports (390×844, 639×734, 701×900, 1280×720), comparing forward and reverse travel.
- Final layout: 16 checkpoints × seven sizes, including 320×568, 700×900 and 844×390; no detected text collisions, clipping or page overflow.
- Browser zoom: all 13 beats at actual 80%, 100% and 125% zoom; no detected text collisions, clipping or page overflow.
- Film continuity: 48 checks covering all six films, held endpoints, direct letter interaction and reduced motion.
- Repeated 700px crossings with frame requests blocked retain both café and ending endpoints.
- Expanded navigation and reduced-motion checks pass at four sizes.
- All films unavailable, reduced motion and no-JavaScript modes pass; the reading fallback contains all 13 chapters.
- Five-size integrated effects test reports no runtime errors and zero idle draws after settling.

Pixel deltas are review signals, not a proof of perceptual seamlessness. The largest remaining measured changes coincide with native camera movement late in the café film and the authored iris transition in Us. Their source frames and boundary captures were inspected. The original separate opening clips still have small lighting/encoding differences at their matched frames.

This is local Chromium/Chrome verification, including the internal browser's viewport dimensions. Physical iOS Safari performance and subjective award-level quality are not established by these checks. No site was deployed and no paid generation was needed for this pass.
