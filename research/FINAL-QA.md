# Complete story validation

Ten chapters are implemented with eleven accepted landscape plates, dedicated portrait compositions, six original generated films, a foreground poppy matte, memory photograph composites and two hold interactions. Screenshots of all ten chapters are recorded separately for 1280×720 and 390×844 in local `qa/`, with contact sheets. The film contacts were also inspected.

Automated Chrome checks cover every chapter through the actual navigation menu, replay, Escape, keyboard hold/release, manual still mode and reading mode. No uncaught page errors, missing runtime assets or horizontal overflow were found. Additional checks cover system reduced motion, failed frame requests (poster fallback), no JavaScript (all ten semantic chapters remain), reverse traversal and 844×390 landscape. Reduced-motion mode retains zero decoded film frames.

Screenshot-driven revisions: purpose-generated portrait café/distance preserve paired objects; desktop final title switched to ivory for contrast; the mobile finale gets a portrait composition; the letter checkpoint now opens on a readable thought; drawer scene retains the café for its return; compact landscape menu preserves access to all chapters.

Local Chrome canvas CPU samples were at or below 4ms during the chapter run. These are not end-to-end FPS, GPU measurements, Lighthouse scores or real-phone Safari results. Physical-device testing and hosted-network performance remain unverified. Runtime caches cap at 48 decoded desktop frames / 24 mobile frames across two sequences; unused bitmaps close on eviction and page exit. Mobile quiet shots use posters, with 640px frames for major moving transitions.

The quality review is grounded in rendered frames, not invented numerical scores. The strongest set pieces are the giant poppy opening, rain/time scene, folding letter and envelope-to-morning passage. Remaining limits: generated-film endpoints are close but not pixel-matched to stills; mobile uses deliberate poster substitutions; there is no physical-phone GPU evidence yet. The final screenshot collection supports reviewing the complete visual arc directly.

V1/V2/V3 were not edited by this task. V1 and V2 remain clean. V3's working-tree status changed externally during the session; its final status was recorded without attempting to revert or reconcile that separate work. V4 is local-only, with no hosting or DNS changes.

Production build: 13.54 kB JavaScript (5.85 kB gzip), approximately 12 kB CSS (3.4 kB gzip), meaningful static HTML. All four unit tests and `git diff --check` pass. A token-pattern check found no OpenRouter key in runtime, scripts, research records or built output. This is a targeted check, not a general security audit.
