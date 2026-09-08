# avoid.love V4

An original ten-chapter cinematic love story, built in a new standalone project. Scarlet poppies, two cups, unsent letters and empty seats recur across photographic worlds. Six generated Seedance films are scrubbed through bounded canvas frame caches. No original-site assets or code are included.

## Run locally

Node 22.12+ (verified with Node 26). `npm ci`, then `npm run dev -- --port 4174`. Open http://127.0.0.1:4174/. `npm test` checks crop/sequence behavior; `npm run build` creates static `dist/`; `npm run preview` previews it. No deployment has been performed.

Scroll, use the bottom continuation control, or choose a chapter in The story menu. Hold the thought in Almost; hold to put it away in the drawer scene. The menu includes Still-frame mode, and keyboard users can skip directly to the complete reading version. System reduced motion selects still mode automatically.

## Mobile

390px portrait has alternate typography and shorter pacing: 18 viewport heights against desktop's 30. Café and distance use purpose-generated portrait artwork preserving both paired objects. Frame assets are 640px wide; quiet opening, waiting and distance shots use posters. Active film caches hold 12 frames each, at most two sequences. Mobile canvas DPR is capped at 1.25. Landscape receives a compact header/footer composition. Physical-device Safari performance remains to be measured.

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

All six films play on mobile. The café and ending hold their real last video frames, with the same crop through the handoff. The renderer interpolates adjacent frames, smooths late-frame catch-up and retains movies across the mobile breakpoint. Mobile keeps at most 16 decoded 1280px frames across two sequences, plus compositor surfaces. Original movie files remain unchanged.

Use `QA_URL=http://127.0.0.1:4188/` for preview QA. `scripts/qa-film-surface.mjs` verifies interpolation and catch-up pixels, `scripts/qa-film-continuity.mjs` checks all six films and held endpoints, and `scripts/qa-video-resize.mjs` blocks frame requests while repeatedly crossing the mobile breakpoint. `scripts/qa-playthings.mjs` and `scripts/qa-interaction.mjs` cover scene effects, keyboard/touch, reduced motion and idle rendering.

The first two handoffs retain their outgoing video until the incoming source is decoded, including delayed-loading cases. Three held endpoints supplement the rolling frame cache. `qa-first-handoffs.mjs` compares displayed outgoing pixels while the incoming film/art is deliberately blocked. New keepsake effects include a curling receipt, a message behind the mist, sunlight refractions and petals that part around your hand.
