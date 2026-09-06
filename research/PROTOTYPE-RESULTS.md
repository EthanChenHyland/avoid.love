# First playable sequence — technical results

Original generated imagery first, implementation second. Two scenes and one genuine Seedance transition are working locally. `/prototypes/transport.html` compares the identical eight-second clip using a 15fps WebP sequence and H.264 currentTime seeking.

A local forward/reverse sweep reported median video seek completion 4.7ms, maximum 251.9ms, canvas draw-call CPU maximum 0.4ms. Cache remained at the configured 24-frame limit and returned to frame zero. These are warm/local measurements on this M1 Max, not end-user FPS or slow-network performance. They support selecting frame sequences for reversible scroll, with poster fallback. Decoding and network time are not included in canvas draw CPU timing.

Automated checks passed: cover crops fill desktop/portrait/orientation dimensions; normalized film traversal clamps and reverses; missing-frame lookup returns nearest available; cache eviction closes distant bitmaps and cleanup releases remaining resources.

Visual iteration: first screenshot exposed caption/title overlap and warm sky leaking into the foreground matte. Adjusted title scale/placement and red-channel selectivity. Revised hero now reads “love,” lower petal crosses the e, and café typography sits in generated negative space. Added brief “oh.” within the red petal passage so the transition contains a recognizable emotional beat.

## Quality judgment at two-scene gate
The opening poster and café art have an appropriate visual ceiling: real generated cinematic material, deliberate scale, coherent texture, original identity. The first draft's still-to-film endpoint mismatch and untested full arc prevent a claim of Pear parity. Proceed with authored remaining assets, preserving this gate as a reference, and refine pacing/endpoint transitions in the full sequence. No fabricated 9/10 scores or blanket “competitive” certification.
