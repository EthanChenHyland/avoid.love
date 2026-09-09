# avoid.love V4

An original eighteen-chapter cinematic love story, built in a new standalone project. Scarlet poppies, two cups, unsent letters and empty seats recur across photographic worlds. Seven generated Seedance films are scrubbed through bounded canvas frame caches. No original-site assets or code are included.

## Run locally

Node 22.12+ (verified with Node 26). `npm ci`, then `npm run dev -- --port 4174`. Open http://127.0.0.1:4174/. `npm test` checks crop/sequence behavior; `npm run build` creates static `dist/`; `npm run preview` previews it. No deployment has been performed.

Scroll, use the bottom continuation control, or choose a chapter in The story menu. Tap the letter in Almost to keep it open, or swipe the photographs directly. The menu includes Still-frame mode, and keyboard users can skip directly to the complete reading version. System reduced motion selects still mode automatically.

## Mobile

Portrait has alternate typography and 28 viewport heights of pacing against desktop's 38. All seven films render their 1280px frames on phones, with continuous crop focus through intermediate aspect ratios. Active film caches hold 8 frames each on mobile (24 on desktop), at most two sequences. Mobile canvas DPR is capped at 1.25. Landscape receives a compact header/footer composition. Physical-device Safari performance remains to be measured.

## Source and production

- `src/story.mjs`: chapter names and normalized checkpoints.
- `src/main.mjs`: native-scroll timeline, scene compositing, navigation and accessible controls.
- `src/sequence.mjs`: progressive frame fetching, nearest-ready fallback and decoded bitmap cleanup.
- `src/style.css`: desktop, portrait, landscape, reading and reduced-motion compositions.
- `research/`: reference analysis, model comparison, art bible, storyboard and sanitized generation provenance.
- `scripts/generate.py`: OpenRouter still-image generation; `scripts/video.py`: video submission/polling. These read OPENROUTER_API_KEY privately from the environment or the local Codex .env. Credentials never enter the website.
- `scripts/prepare-assets.mjs`: responsive image exports, foreground matte, licensed fonts and social preview.
- `scripts/prepare-films.py`: 15fps responsive WebP sequences and H.264 comparison films. Requires Python pillow and imageio-ffmpeg.
- `prototypes/transport.html`: development-only comparison of video seeking and image sequences.
- `scripts/qa-browser.mjs`: optional headless Chrome chapter/navigation screenshots. Install Playwright separately with `npm install --no-save --package-lock=false playwright`; requires local Chrome. Screenshots and output live in ignored `qa/`.

Generated originals live in ignored `art-source/`; optimized runtime outputs are included. Local raw originals are required to regenerate assets. Public fonts include their OFL licenses. Robots, sitemap, canonical and social metadata target the eventual avoid.love domain. They do not configure hosting, DNS or Search Console.

## Readability and live-material refinement

`src/refinement.css` owns the film-aware safe zones and intermediate/short-screen composition. `src/interaction.mjs` adds restrained tabletop depth in Little Things/Love, projected window light in Almost and the recurring live red thread. All effects share the existing render loop, settle to idle, support passive touch input and respect reduced motion. Recreate the four derived depth mattes with `node scripts/prepare-depth.mjs` after exporting the accepted artwork.

Production QA uses `npm run build` and `npm run preview -- --port 4175`, then `node scripts/qa-layout.mjs`, `node scripts/qa-production.mjs`, and `node scripts/qa-interaction.mjs`. `qa-zoom.mjs` additionally requires `npx playwright install chromium`; it uses a temporary isolated extension fixture to set real browser zoom and removes its test profile afterward. These QA tools do not ship to visitors. See `research/FINAL-QA.md` for scope, evidence and limitations.

## Scene interactions and video continuity

Petals arrive automatically, photographs fan out and turn over with scrolling, rain clears with scroll/touch, and the red thread follows pointer movement. Photos can be swiped in place. Coffee steam, rain trails and glass ripples respond to your hand. Tap or keyboard-activate the paper itself to keep the letter open, then activate it again to let it fold away. There are no effect launchers or separate dialogs. Reduced motion keeps the composition static.

All seven films play on mobile. The café and ending hold their real last video frames, with the same crop through the handoff. The renderer interpolates adjacent frames, switches late-frame catch-up opaquely and retains movies across the mobile breakpoint. Mobile keeps at most 16 decoded 1280px frames across two sequences, plus compositor surfaces. Original movie files remain unchanged.

Use `QA_URL=http://127.0.0.1:4188/` for preview QA. `scripts/qa-film-surface.mjs` verifies adjacent interpolation and opaque catch-up pixels, `scripts/qa-film-continuity.mjs` checks all six films and held endpoints, and `scripts/qa-video-resize.mjs` blocks frame requests while repeatedly crossing the mobile breakpoint. `scripts/qa-playthings.mjs` and `scripts/qa-interaction.mjs` cover scene effects, keyboard/touch, reduced motion and idle rendering.

The first two handoffs retain their outgoing video until the incoming source is decoded, including delayed-loading cases. Three held endpoints supplement the rolling frame cache. `qa-first-handoffs.mjs` compares displayed outgoing pixels while the incoming film/art is deliberately blocked. New keepsake effects include a curling receipt, a message behind the mist, sunlight refractions and petals that part around your hand.

The opening renders opaque film frames: no crossfade at the film join, no loading fade, no adjacent-frame blending, and no catch-up dissolve. Other chapters retain their existing interpolation. Scroll-driven petals, memory-light ribbons, ink branches, orbiting letters and sunlight motes live in `src/story-spectacle.mjs`; they share the existing renderer, respond to visitor movement, and honor reduced motion.

The opening camera moves in and gently returns to its initial framing, matching the next clip’s starting frame before the opaque handoff. `scripts/qa-opening-match.mjs` checks this join in both scroll directions across phone, panel and desktop sizes.

## Expanded chapters and continuity audit

After hours, The detour, and Let the light in extend the original narrative to 13 selectable chapters without replacing any original film. `src/chapter-effects.mjs` choreographs a winding clock, a perspective street map with a live route, a 3D photograph gallery, soft window projections, rolling heading reveals, and a short-lived pointer ribbon. These complement the petal vortex, physical keepsakes, steam, rain, ink, envelopes and sunlight already present. The extra beats are also available in the reading and no-JavaScript versions.

Everywhere now uses the opening frame of its own film from scene entry, keeping the crop consistent when the camera begins moving. The giant full-screen photo rush has become an edge gallery. The rain-glass sample follows the same continuous crop as the film, and the header shade gradually clears in the ending. Cache catch-up never dissolves unrelated old and new frames.

`qa-boundary-audit.mjs` samples 30 timeline boundaries forward and backward at four viewport sizes. `qa-expansion.mjs` checks new chapter navigation and reduced motion, and `qa-expanded-resilience.mjs` covers all films unavailable, reduced motion and the 13-chapter no-JavaScript reading fallback. Numerical pixel changes identify review candidates; they do not by themselves distinguish intended camera movement from a cut.

## Sixteen-chapter material expansion

Between the pages, Blue hour, and The space between add three more complete beats, including navigation and reading fallbacks. `src/material-scenes.mjs` draws an opening book and pressed poppy, actual film-sampling rain lenses, drifting city bokeh, a rain constellation, touch-responsive thread fields, folded-paper birds, and soft petal shadows on the final table. All are procedural live canvas effects and use the original background films. The new layers are scroll-driven and do not add a perpetual animation loop. The final display word keeps the original large typographic scale; only `#avoid-word` receives the smaller prefix styling.

The photographs yield their space before the book opens, and existing captions end before each new chapter begins. `scripts/qa-material-scenes.mjs` checks the three new beats, chapter navigation, live pointer response screenshots, and the final display-word size on four viewports.

## Curved opaque pages and a seventh film

The book leaf is now an inextensible strip mesh, hinged at the spine, with changing curvature, front/back lighting, and a cast shadow. The whole book is composited offscreen at 2× resolution with opaque internal paper layers; its entrance slides rather than fading. The flower is exposed by the moving page edge instead of showing through it. `src/page-turn.mjs` contains the geometry; Node tests verify the hinge, arc length, end positions and mid-turn curvature. A browser pixel regression compares the closed page over different background colors.

All the unsaid things and What stayed bring the narrative to 18 chapters, with an embossed wax seal and a turning brass key. A new six-second Seedance film animates the keepsake drawer and ribbon. It uses the existing drawer reference, adds 91 scrubbed frames, and leaves the original six films untouched. Generation provenance and reported cost ($0.9135) are in `research/video-kept-film.json`; no credential or signed download URL is retained there. `scripts/prepare-additional-film.py` exports one new film without rebuilding the original sequences.
