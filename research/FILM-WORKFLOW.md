# Original films

OpenRouter's current dedicated Video API was discovered during research and supports Seedance using the existing local OpenRouter credential. No additional provider account was needed. Earlier provisional notes about unavailable film credentials are superseded by this tested route.

Live catalog: `research/video-models.json`. Selected `bytedance/seedance-2.0`, 720p, 16:9, 6s poppy shot and 8s start/end frame transition, no generated audio. Both requests completed and their original MP4s are in ignored `art-source/`. Exact requests and reported costs: video-poppy-film.json, video-petal-transition.json. No credentials are written to those records.

## Evaluation
The poppy clip preserves tactile petal flutter and slow camera movement. Transition successfully enters red petal darkness and emerges from a café flower. It changes camera framing and the café chair arrangement slightly relative to reference plates. Those changes need a composed bridge, not a claim of perfect endpoint matching. This is genuine generated footage, not CSS motion presented as AI film.

## Delivery
Extract 15fps WebP frames at 1280px desktop / 640px mobile, 121 transition frames and 91 opening frames. High-quality original PNGs remain outside public payload. H.264, short 6-frame GOP, no audio, faststart alternative prepared for transport comparison. Canvas keeps at most 24 desktop or 12 mobile frames, prefetches nearby frames and draws nearest decoded frame on missing target. Memory is released explicitly via ImageBitmap.close and AbortController.

Prototype `/prototypes/transport.html` compares the same source through frame sequence and currentTime seeking, with forward/reverse sweep and render/seek timing readout. This is a development artifact, not visitor UI.

## Safety and reproducibility
Generation scripts only run locally. Credential loaded from environment or the user's local credential file. Download uses the trusted OpenRouter content endpoint and strips Authorization on cross-origin redirects. No account signup, public deployment, or private-reference upload. Only original generated stills are sent as film references.

Reported total for first two films: $2.1294.
