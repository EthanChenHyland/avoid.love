# Complete story validation

Ten chapters are implemented with eleven accepted landscape plates, dedicated portrait compositions, six original generated films, a foreground poppy matte, memory photograph composites and two hold interactions. Screenshots of all ten chapters are recorded separately for 1280×720 and 390×844 in local `qa/`, with contact sheets. The film contacts were also inspected.

Automated Chrome checks cover every chapter through the actual navigation menu, replay, Escape, keyboard hold/release, manual still mode and reading mode. No uncaught page errors, missing runtime assets or horizontal overflow were found. Additional checks cover system reduced motion, failed frame requests (poster fallback), no JavaScript (all ten semantic chapters remain), reverse traversal and 844×390 landscape. Reduced-motion mode retains zero decoded film frames.

Screenshot-driven revisions: purpose-generated portrait café/distance preserve paired objects; desktop final title switched to ivory for contrast; the mobile finale gets a portrait composition; the letter checkpoint now opens on a readable thought; drawer scene retains the café for its return; compact landscape menu preserves access to all chapters.

Local Chrome canvas CPU samples were at or below 4ms during the chapter run. These are not end-to-end FPS, GPU measurements, Lighthouse scores or real-phone Safari results. Physical-device testing and hosted-network performance remain unverified. Runtime caches cap at 48 decoded desktop frames / 24 mobile frames across two sequences; unused bitmaps close on eviction and page exit. Mobile quiet shots use posters, with 640px frames for major moving transitions.

The quality review is grounded in rendered frames, not invented numerical scores. The strongest set pieces are the giant poppy opening, rain/time scene, folding letter and envelope-to-morning passage. Remaining limits: generated-film endpoints are close but not pixel-matched to stills; mobile uses deliberate poster substitutions; there is no physical-phone GPU evidence yet. The final screenshot collection supports reviewing the complete visual arc directly.

V1/V2/V3 were not edited by this task. V1 and V2 remain clean. V3's working-tree status changed externally during the session; its final status was recorded without attempting to revert or reconcile that separate work. V4 is local-only, with no hosting or DNS changes.

Production build: 13.54 kB JavaScript (5.85 kB gzip), approximately 12 kB CSS (3.4 kB gzip), meaningful static HTML. All four unit tests and `git diff --check` pass. A token-pattern check found no OpenRouter key in runtime, scripts, research records or built output. This is a targeted check, not a general security audit.

## Readability and live-material refinement — 2026-09-07

The accepted ten chapters and all six films are preserved. SHA-256 comparisons against the accepted V4 commit are recorded in `FILM-INTEGRITY.json`; film sequences and manifest are also unchanged. No new film or story-image generation was performed.

Text corrections: outgoing/incoming copy now has exclusive timing intervals; headline, caption and navigation occupy separate safe zones; opening movement is limited by available header clearance; short landscape layouts use side-by-side copy; wider portrait layouts lift the opening; final copy flows vertically; moving paper/photo shots receive local exposure correction. Essential type is larger (generally 17–19px body copy, 15–16px controls). The decorative masthead caption was removed. Intentional flower/type occlusion and the oversized mobile opening remain.

Three live effects complement the films: layered tabletop depth in Little Things and Love; three softly feathered window-light panes projected over the letter; a fine red thread that follows the recurring objects, stretches across Distance, retreats in Trying, and returns for the ending. A shared settling visitor state feeds the existing RAF loop. Passive touch input preserves native scroll and pinch behavior. Reduced motion disables pointer depth/light and keeps the thread static. No new runtime dependency or WebGL system was added. The four depth mattes derive directly from accepted artwork.

### Production evidence

- Production output served locally by Vite preview, including the user's existing port 4174. No deployment.
- Layout sampling: 1920×1080, 1440×900, 1280×720, 1024×768, 768×1024, 700×900, 390×844 and 844×390; additional short/intermediate checks at 950×601, 1280×650, 1152×730 and 600×700. Film and chapter boundary samples included. The final edge-case pass reported zero accidental glyph collisions, essential-copy clipping or horizontal overflow. Automated glyph estimates supplement screenshot inspection; they are not a claim about every possible viewport or frame.
- Actual browser zoom at 80%, 100%, 125%, verified through `chrome.tabs.getZoom` in an isolated temporary Chromium profile: CSS viewports 1800×1141, 1440×913 and 1152×730. All ten chapters traversed and captured at each zoom. Screenshot capture uses the compositor surface so browser zoom is represented correctly. Fixture follows the official [Playwright extension workflow](https://playwright.dev/docs/chrome-extensions) and [Chrome zoom API](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-setZoom).
- 106 production records cover all ten chapters at desktop/390px in normal, reduced-motion, blocked-frame and delayed-art modes; plus beginning/middle/end samples from every generated film. No unexpected HTTP errors, uncaught errors, detected text collisions or overflow in those traversals. Deliberately blocked frame requests correctly used poster fallback. Delayed artwork was also captured before settling.
- Pointer and real emulated touch events tested in both depth scenes and the letter. Native touch scrolling remains active. Orientation/viewport changes preserve normalized story position. Reduced motion resets visitor response and releases film caches. Keyboard/menu/replay/reading behavior is retained.
- Idle RAF callback count stayed unchanged over the observation window in every production mode. Observed decoded-frame bounds remain 48 desktop / 24 mobile; the local production sample's maximum canvas CPU duration was 3ms. These are local CPU/cache observations, not end-to-end FPS or physical-phone GPU measurements.
- Six unit tests pass. Latest production build remains approximately 19 kB JavaScript / 8 kB gzip and 17 kB CSS / 4.4 kB gzip. Build output and `git diff --check` pass.

New visual evidence: `qa/refined-desktop-storyboard.jpg`, `qa/refined-mobile-storyboard.jpg`, `qa/refined-film-contact.jpg`, and pointer/touch comparison images under `qa/interaction/`. Detailed JSON reports and zoom captures remain in local ignored `qa/`.

Physical-device Safari is still outstanding and is not marked passed. No hosted-network, Search Console or deployment validation is claimed.

## Additional interaction and transition pass — 2026-09-07

Added two optional features without replacing any film: a kept-photograph dialog in Little Things/Us with a reversible note side, and touch/drag-to-clear window mist in Waiting. Native dialog focus containment, Escape, close-button focus restoration and keyboard clear/reset controls were exercised at 1280px and 390px. The mobile photograph preserves both cups instead of cropping into a single cup. The mist mask has feathered edges so it remains environmental rather than a rectangular overlay. A direct emulated touch cleared a local patch while narrative progress stayed at 0.3700. Physical Safari remains untested.

Corrected concrete transition discontinuities: opening-film removal before its successor was opaque; outgoing moving rain/letter frames being overwritten with still posters; montage source switches occurring midway through an unfinished wipe; modulo-based zoom resets; distance's split opening at a nonzero gap; and the memory montage disappearing before the final film took over. The letter hold gesture now interpolates toward the open frame. Incoming decoded sequences dissolve in over 220ms; masks have feathered edges extending beyond the viewport at their endpoints. All six original films, their frame assets and manifest remain unchanged.

`qa/cuts/report.json` records 48 paired samples across 24 transition positions at 1280px/390px. Maximum normalized mean RGB difference was approximately 0.043; inspection of that pair showed continuous photograph scale movement rather than a source cut. This is a targeted local continuity check, not a guarantee that every source-film endpoint is pixel-matched. The source films themselves are preserved.

The added controls passed the 1280×720, 390×844 and 844×390 glyph/overflow checks. Production screenshots and dialog front/back states are under `qa/memory/`. Build output is approximately 23 kB JavaScript (9.2 kB gzip), 19.7 kB CSS (4.9 kB gzip). No runtime dependency was added; small reusable offscreen canvases handle wipe feathering and mist. Existing frame-cache limits remain unchanged.

The full additional-feature production traversal completed with 106 records, no unexpected errors, no detected clipping/collisions/overflow, and zero idle RAF callbacks in all eight mode/viewport combinations. Raw records are preserved in `qa/production/full-report.json`. An initial worst local draw sample of 19ms motivated removing the mist's main-canvas copy; it now samples the already decoded image/frame directly. The normal production traversal and memory controls were repeated after that optimization. This measurement remains local CPU timing, not a physical-device FPS claim.

Post-optimization normal traversal: 40 records, zero reported issues, idle rendering stopped. Worst observed canvas CPU sample was 20.7ms desktop and 12.3ms mobile under local headless testing, including transient compositing work; these effects add some cost relative to the earlier simpler renderer. Do not interpret the unchanged cache bounds as proof of unchanged frame time. Physical-device profiling remains outstanding.

## September 7 — mobile transition and expanded interactions

Continued the accepted V4. Fixed the diagonal wipe's canvas coordinate system: create the gradient after the shear transform, so the masked image reaches its endpoint continuously. Phones use a longer café → Little Things dissolve (.230–.265), with the same scale and depth drawing on both sides of completion.

Added a five-image photograph collection with swipe, previous/next, arrow keys and flip notes; an editable unsent letter that folds and reopens, held only in this tab; a keyboard/touch range control that visibly pulls a glowing red thread closer; and user-triggered petal bursts at the opening and ending. Petals use the existing animation clock, stop after three seconds, and become a static arrangement in reduced-motion mode. Dialogs pause the story and restore focus. Original six films and frame files are unchanged.

Validation: production build and all six unit tests pass. `qa-playthings.mjs` exercises the four additions at 320×740, 390×844, 600×700, 844×390 and 1280×720, including reduced motion, note retention, gallery drag/keyboard interaction, and no horizontal overflow or browser errors. Existing photo/mist regression passes desktop and phone. Extended text probe includes scene controls: 44 phone/intermediate/landscape samples had no text clipping/collisions. Visual review caught and corrected thread control visibility/overlap and landscape gallery navigation overlap. The 48-boundary image check recorded normalized mean differences of .0000 at the mobile café transition start and .00356 around .255. These are sampled Chromium checks, not a physical iOS Safari guarantee.

Local preview: http://127.0.0.1:4174/. No deployment.

## September 7 — integrated, automatic scene behavior (supersedes launcher pass)

Removed the effect toolbar, note form, and photograph modal. Petals now enter automatically with the opening/final scenes and drift with scroll; the short entry animation stops at idle. The photograph stack appears and fans out on the table during Little Things and Us, with direct pointer tilt, horizontal touch swipes, and keyboard cycling on the artwork itself. Rain clears progressively with scroll and responds to hovering or touch. Window light appears automatically on the existing unfolding-letter film. The red thread responds more visibly to pointer/touch movement. All scene entrances/exits have opacity envelopes; mobile café → Little Things retains the extended dissolve. The six original films remain unchanged.

Native Chromium touch dispatch verifies inline swiping without a modal and preserves vertical page scrolling. Pointer/touch, resize position, and reduced-motion regression passes. Production build and six unit tests pass. The integrated QA script checks 55 story positions across 320×740, 390×844, 600×700, 844×390, and 1280×720, includes keyboard photograph cycling and reduced motion, and checks the renderer settles after automatic effects. Visual inspection corrected the short-landscape photograph/caption overlap. Boundary image sampling includes the mobile dissolve completion at .265. Physical iOS Safari remains untested.

Other processes replaced the earlier previews on ports 4174/4175. This V4 is now independently verified on http://127.0.0.1:4188/. QA scripts accept QA_URL to avoid checking a different site accidentally. Local only; no deployment.

## September 7 — remaining portrait café / ending cuts

Fixed three independent causes: insufficient overscan when translating depth layers, duplicate cup/table contours from the portrait depth matte, and the mobile shading overlay switching off at a fixed chapter threshold. Portrait depth now moves a single image; desktop depth layers use a shared safe crop scale. A geometric regression test checks all edges across portrait/landscape sources and both pointer extremes. The shading veil fades continuously with the ending image.

Portrait café handoff begins earlier within the petal passage, avoiding the final landscape café framing before the dedicated portrait. The ending portrait blends over .925–.982 and retains the outgoing film until the incoming image has decoded and faded in. This applies by aspect ratio, including tablet widths above the 700px mobile asset breakpoint. Original movie files are unchanged.

Validation: production build and seven tests pass. Text/layout audit: 126 positions across 320×568, 360×640, 390×844, 430×932, 600×800, 700×900, 701×900, 768×1024 and 844×390, with no clipping/collisions. `qa-mobile-handoffs.mjs` checks 77 forward/reverse frames across seven widths, canvas edge exposure at pointer extremes, and delayed final-art loading. Screenshots reviewed for the café, end blend, completed ending and slow-loading fallback. Chromium emulation, not physical Safari testing. Preview remains http://127.0.0.1:4188/.

## September 7 — internal-browser follow-up: continuous portrait scenes

The prior long blend still transitioned between differently composed landscape film frames and portrait artwork. Changed the responsive sequence itself: portrait viewports now use the accepted portrait plates continuously for the café and final passage, with scroll-driven transitions and live motion. The opening portrait also retains its single source throughout. Wide layouts retain the original films; no film files were regenerated or modified. The internal browser was inspected by a local desktop screenshot; detailed automated motion checks use the observed approximately 639×734 viewport, rather than claiming control of the embedded browser's scrolling.

Responsive asset replacement retains the old decoded plate and blends in its replacement instead of emptying the canvas at 700px. Added source-selection QA for 390×844, 639×734, 700×900, 701×900, including reverse travel and repeated breakpoint resizing. The test asserts that the café/ending do not switch to landscape movie frames in portrait mode.

Added scene-integrated coffee steam and rain trails, wind-responsive petals, and automatic photograph flips revealing short notes on their backs. No effect launch buttons or modal dialogs. Effects share the existing RAF and settle within 4.5 seconds, respect reduced motion, and preserve native touch scrolling. Updated idle QA accordingly. Production build, seven unit tests, the five-size interaction/layout suite, and 77 handoff/edge samples pass. Fresh preview navigation: http://127.0.0.1:4188/?review=portrait-continuity#notice.

## September 7 — restore portrait video at user request

Restored the café transition and impossible-to-morning film playback in portrait layouts, including the embedded browser. The café film runs through its complete frame range before the portrait artwork blends in (.76–.90 of the first act); the ending film completes at .95 story progress before the portrait blend (.95–.982). Kept all new atmosphere/photo interactions, the overscan correction, single-plane portrait depth, continuous shading, and responsive asset retention. Updated the portrait-source test to require decoded movie frames in both passages. The earlier portrait-still approach is superseded. Seven unit tests and production build pass; original video assets unchanged.

## September 7 — all-video continuity and direct scene interactions

Replaced the café/final poster handoffs with held movie endpoints. The café keeps frame 120, including its crop anchor, through the following scene's dissolve; the ending retains frame 120 for the rest of the story. This removes the differently composed artwork swap while preserving the complete original films. All six films now run on mobile. Reduced-motion mode retains still artwork.

Added a stable FilmSurface per active sequence: adjacent frames interpolate at fractional scroll positions; large cache catch-up jumps blend from the displayed surface for 140ms. Distant in-flight requests are aborted when scroll direction/position changes; upcoming films are warmed without evicting an outgoing film during its overlap. All movie frames use the existing 1280px source; mobile cache is eight frames per sequence, two sequences maximum (16 decoded frames), plus compositor surfaces. The sampled maximum draw time was 19ms in headless Chromium; no physical-device FPS claim.

Crossing 700px no longer disposes decoded movies. Crop anchors vary continuously with viewport aspect ratio, and portrait café dissolves use aspect ratio rather than an abrupt width switch. A dedicated test blocks all frame requests and repeatedly resizes through 700px; both held endpoints remain decoded and displayed. A canvas pixel test verifies fractional interpolation, catch-up blending, and idle settling. Movie QA validates all six films plus held endpoints at 390, 639, 701 and 1280 widths (48 samples), direct letter tapping and reduced-motion fallback. Eight unit tests pass, including stale-request cancellation. Existing touch/resize/reduced-motion interaction suite passes.

New direct features: touch or keyboard-activate the paper itself to hold the unsent letter open/release it; rain-glass ripples appear automatically and follow touch/hover. These extend the existing photo flips, steam, rain trails, wind-responsive petals and red thread. No launcher toolbar, no modal. Existing film files and frame assets remain unmodified.

## September 7 — first two handoffs and expanded keepsakes

The opening video now starts at frame zero immediately; its outgoing frame stays underneath the next film throughout a longer, readiness-aware blend. The old .35 first-act cutoff no longer removes it. The static poppy foreground fades with actual first-video readiness, with the same crop anchor, instead of disappearing later at a scroll threshold. Little Things keeps the café endpoint under its dissolve until its artwork has decoded and faded in, including beyond the old .255/.265 cutoff. Both portrait and landscape use this same handoff rule.

A bounded endpoint cache retains three copied final frames separately from rolling frame eviction. Endpoints are saved only once the initial film fade and catch-up dissolve have completed; they are released on pagehide. Upcoming-film warming no longer evicts a film while the two opening movies overlap.

`qa-first-handoffs.mjs` blocks the entire incoming petal sequence and then the Little Things portrait artwork. At progress .105 and .29, after the former cutoff points, outgoing video pixels still match the original film endpoint within 0.11% normalized difference in an unobstructed region. Eight unit tests, all 48 movie/endpoint samples, and the five-size interaction/idle suite pass. Screenshots reviewed at 320×568, 390×844, 639×734 and 844×390.

New effects: a receipt curls open among the keepsakes and lifts with pointer motion; “still here.” emerges through the waiting-room mist; final-window refractions follow the hand; petals bend away from the pointer/finger. These are in-scene canvas effects with no new modal or launch button, and reduced-motion support. Original videos remain intact.

### September 8 — opening camera join and scroll spectacle

Removed the extended opening `.29–.44` dissolve. The new `.29–.305` join only blends stationary endpoints; the next film starts its camera move after the join and still reaches its original final frame at `.74`. Loading protection and the six original films are retained. Added a regression test that prevents camera movement during the join.

Added scroll-driven foreground petal spirals, a hand-responsive luminous memory ribbon, ink branches, orbiting sealed letters, and final sunlight motes. These share the existing canvas loop, reduce particle counts on phones, and skip under reduced motion. No additional asset cache or animation timer. Short portrait screens also receive a separate opening title/caption spacing rule.

Validation: production build and nine Node tests pass. Delayed incoming-film and incoming-art pixel checks retain the outgoing images (normalized differences .000906 and .001005). Forward/reverse samples at 390×844, 639×734, and 1280×720 confirm frame zero throughout the join, followed by progressing film frames. Five-size integrated checks passed with no runtime errors, functioning photograph keyboard input, reduced-motion rendering, and zero idle draws after settling. Original film files, frame sequences, and manifest unchanged. Browser checks use Chromium, including the internal-browser viewport size; they are not physical iOS device validation.

### September 8 — remove opening dissolves completely

The preceding stationary-endpoint join still used a short dissolve. Removed that blend entirely and disabled both initial loading fades and FilmSurface interpolation/catch-up dissolves for `opening` and `transition`. Removed the opening foreground opacity animation. The two films now draw opaque decoded frames; the retained outgoing image remains the loading fallback. All spectacle effects and other chapters' interpolation remain intact.

Nine Node tests pass, including binary opening handoff opacity. Browser pixel tests verify that opening adjacent frames never mix and a large frame jump immediately draws the new opaque frame, while other scenes preserve their interpolation behavior.

### September 8 — match the source framing at the opening join

The opaque join exposed a real source mismatch: opening frame 090 is substantially closer than transition frame 000. Opening frame 000 shares the transition's framing. Retimed the opening into a smooth forward-and-return camera movement, ending on frame 000 before the transition starts. No opacity blend was restored and no original media was changed. Existing effects remain.

Added a source-endpoint timeline regression and a browser pixel comparison across the join in both directions at 320, 390, 639, 700, 701 and 1280 pixel widths. Direct source mean RGB difference drops from 7.41% (090→000) to 0.73% (000→000); the latter frames still have encoding/lighting differences. Build and ten Node tests pass; delayed-loading outgoing-frame retention tests also pass.

### September 8 — full-site audit and 13-chapter expansion

See `SITE-AUDIT-2026-09-08.md` for findings, scene-by-scene corrections, new behavior and verification scope. Removed the poster/film double exposure in Everywhere and unrelated cache catch-up dissolves, matched fog focus through responsive sizes, and removed the ending header shade threshold. Added three integrated chapters, clock/route/gallery/light choreography, rolling typography and a bounded visitor ribbon. Final seven-size layout and 39 real-browser-zoom checks have no reported collisions, clipping or overflow. Original films and frame assets remain unchanged.

### September 9 — sixteen chapters and live material effects

Added Between the pages (.298), Blue hour (.405), and The space between (.736), including navigation, exclusive copy windows and reading/no-JavaScript content. The original films and their timing remain; overall pacing now spans 38 desktop / 28 mobile viewport heights. New canvas material scenes include an unfolding book with a pressed poppy, true film-sampling rain lenses, drifting bokeh and a rain constellation, visitor-responsive thread fields, folded-paper birds and final petal shadows. The prior photo stack clears before the book opens.

Visual review also caught a styling regression from heading word wrappers: the CSS intended for the small `avoid.` prefix applied to the wrapped final `love` too. Scoped that rule to `#avoid-word` and verified the final word retains a font size of at least 150px in all four material-scene viewport checks.

Validation: production build and 10 Node tests pass; 91 final layout samples across seven sizes report no collisions, clipping or overflow. Four-size new-chapter navigation and material-scene checks pass. Film regression covers 48 movie/endpoint samples, letter activation and reduced motion. Five-size integrated effects checks have no runtime errors and zero idle draws after settling. Reduced motion, all films unavailable and the 16-chapter no-JavaScript fallback pass. Screenshots of the new book, rain, thread and ending compositions were inspected on portrait and desktop. All original film and frame files remain unchanged. No external generation was needed for these procedural additions.

### September 9 — opaque curled page, 18 chapters, seventh generated film

Replaced the cosine-scaled book rectangle with a curved strip mesh. The leaf retains its arc length and spine hinge throughout the turn, bends in depth, casts a moving contact shadow, and stays in place after landing. Book composition is isolated at 2× resolution with internally opaque paper; the book slides into view rather than fading through the flower. Browser pixel checks show identical closed-page pixels over red and blue backgrounds, and geometry tests verify the end positions, mid-turn curvature and constant length. Closed, middle and landed page screenshots were visually reviewed.

Generated `kept-film` through the existing OpenRouter Seedance workflow: 6 seconds, 720p, silent, 91 exported frames. Reported generation cost $0.9135. Reviewed first, middle and final frames before integration; the original six films remain unchanged. The new film replaces the still drawer/shutter treatment in Put it away and What stayed. The new All the unsaid things chapter adds a wax seal; What stayed adds a turning brass key. Both are available in navigation and reading fallbacks.

Final validation: 12 Node tests, the opaque-page browser pixel test, 56 movie/endpoint checks covering all seven films, and 105 layout samples across seven screen sizes pass. Expanded navigation checks pass at four sizes; reduced-motion, unavailable-film and 18-chapter no-JavaScript fallbacks pass. The new chapter and page-turn screenshots were visually reviewed. Build completes successfully.

### September 9 — remove seal, replace ribbon footage, direct page input

Removed the entire wax seal. Regenerated the drawer film using the same first and last reference and an explicit no-ribbon inventory. Reviewed twelve sampled frames and enlarged frames 020, 025, and 029. The paper lifts and settles; no ribbon appears. Maximum adjacent mean RGB difference at 160×90 was 1.06% at frame 031; this supports the sampled visual review but is not proof against every perceptual discontinuity. The export contains 91 frames over six seconds. Generation cost was $0.9135; provenance is sanitized. Removed the old faulty public export and retained the original six films unchanged.

Added direct horizontal page dragging, native touch swipes, and keyboard turning, with a responsive bookmark. Book controls and native vertical scrolling pass at 390×844 and 1280×720. Film continuity: 56 movie and held-endpoint checks, letter interaction, and reduced motion pass. Effects: 320×740, 390×844, 600×700, 844×390, and 1280×720 pass without errors and with zero idle draws. Automated browser checks use Chromium, not the embedded browser.

### September 10 — drawer flash during reverse scrolling

Reproduced a decoded-frame loss in What stayed under 120 ms frame-request latency: the original cache fell back to a still image for 20 sampled renders in the mobile regression. The sequence cache evicted by creation order, so bringing an earlier film back could discard the drawer while it was still visible. Refreshing cache recency whenever a sequence is used keeps the visible film while retaining the existing two-sequence memory bound. No footage or transition timing changed.

Added `scripts/qa-kept-flash.mjs` to exercise repeated forward/reverse traversal of the drawer and both neighboring handoffs at 390×844 and 1280×720 with delayed requests. It asserts that decoded drawer frames never disappear after the film is ready.

Validation: the new regression passes with 319 mobile and 313 desktop sampled drawer renders; no decoded-frame losses. All 56 existing movie/endpoint checks, letter interaction, reduced motion, and 12 unit tests pass. Production build succeeds.

### September 10 — let viewers see the drawer animation

The drawer clip previously consumed its six seconds across scroll progress .75–.82, before What stayed became fully visible at .799. It now holds its first frame through the preceding chapter and plays automatically in visible time once What stayed is fully on screen. It advances even when the viewer stops scrolling, waits for decoded frames, pauses outside the chapter, and retains its displayed frame through both handoffs. A new visit after leaving the drawer region resets playback. Reduced motion uses the existing still presentation.

Added a playback state test and a browser regression covering delayed start, stationary playback, reverse handoff retention, replay, and reduced motion at mobile and desktop sizes.

Validation: stationary-playback browser checks pass at 390×844 and 1280×720, including reverse navigation without premature playback. The delayed-loading flash regression passes on both sizes. All 13 unit tests and the production build pass.

### September 10 — replace late autoplay with chapter-aligned scrubbing

Removed the visible-time playback experiment after user review found the animation continued as the viewer left. Drawer footage now maps exclusively to progress .799–.814, the interval where What stayed's copy is fully opaque. Entry holds frame 0; exit holds frame 90 before the next wipe begins at .82. Stopping scrolling holds the current frame, and reversing scroll reverses the footage. The cache continuity fix remains in place.

Updated the mobile/desktop playback regression to verify first-frame entry, movement only beneath fully visible copy, no timed movement while stationary, last-frame exit, reverse traversal, and reduced motion.

Validation: playback checks pass at 390×844 and 1280×720. Delayed-loading continuity checks pass with 323 mobile and 305 desktop samples and zero missing decoded drawer frames. All 13 unit tests and the production build pass.
