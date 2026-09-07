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
