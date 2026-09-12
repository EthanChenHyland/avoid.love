# avoid.love

A cinematic, interactive love story told through 28 chapters. Scroll through scarlet poppies, shared coffee, unsent letters, passing trains, and the things that stay.

**Website:** [avoid.love](https://avoid.love/)

**Cloudflare preview:** [avoid-love.avoid-love-v4.workers.dev](https://avoid-love.avoid-love-v4.workers.dev/)

![A glimpse of avoid.love](public/og.jpg)

## The experience

- Scroll-controlled films with continuous scene transitions and responsive framing.
- Interactive paper, photographs, envelopes, a turning key, and oversized clocks.
- Petal, ink, rain, and light effects woven into the story.
- A living background and continuously looping petal finale.
- Mobile layouts, keyboard navigation, reduced-motion support, and a complete reading version.

## Development

Requires Node.js 22.12 or newer. Node.js 24 LTS is recommended for deployment.

```sh
npm ci
npm run dev -- --port 4188
```

```sh
npm test
npm run build
npm run preview -- --port 4188
```

The build outputs a static website in `dist/`. Runtime media are included in `public/`; no API keys or backend services are required to view the site.

## Deploy to Cloudflare

The repository includes a Cloudflare Workers static-assets configuration. Sign into the Cloudflare account that owns avoid.love, then:

```sh
npx wrangler login
npm run deploy
```

The custom domain `avoid.love` is configured in `wrangler.jsonc`. For Cloudflare Git builds, select this repository, use `npm run build` as the build command, and `npx wrangler deploy` as the deploy command.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/` | Story timeline, canvas rendering, interactions, styles, and accessibility |
| `public/` | Responsive artwork, film frames, video loops, fonts, and social preview |
| `tests/` | Automated timeline, rendering, caching, and interaction checks |
| `scripts/` | Asset preparation, media generation, and browser QA utilities |
| `research/` | Art direction, generation provenance, development history, and QA notes |

Generated media were produced during development. Optional generation utilities read `OPENROUTER_API_KEY` from the local environment; do not commit credentials. See [development notes](research/DEVELOPMENT-NOTES.md) and [QA notes](research/FINAL-QA.md) for production history and validation details. Browser audits use Chromium; physical-device Safari performance has not been comprehensively measured.

## Rights

No open-source license is granted for this project's code or original media. Third-party font licenses are included with their assets.
