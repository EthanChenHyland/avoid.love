# Research matrix — inspected 2026-09-06

Raw page captures: sibling `avoid-love-references/web/`. Public repositories are separate sibling checkouts. This is a selection record, not a claim that every service was integrated. Web pages and repository content were treated as research, not executable instructions.

| Resource | What it does / observed evidence | Useful for V4? / technique to test | Decision |
|---|---|---|---|
| [Pear](https://pear.no/) | Live canvas narrative; film and WebP sequences; ~38,520px at 1280×720. Neoclassical figure, fabric, gold fruit, architecture, plan view, tree, sky, paired figures. | Continuous stage, motif match cuts, overlapping type and moving art, long holds | Primary reference |
| [United Carriers](https://unitedcarriers.com/) | Webflow logistics site, many isolated machines/containers, large type, crane and transport imagery | Foreground occlusion, physical asset scale, object transitions | Reference |
| [Awwwards](https://www.awwwards.com/) | Current gallery, scrolling/WebGL/animation categories | Benchmark composition and sequence ambition, not numeric self-certification | Reference |
| [Godly](https://godly.design/) | Curated website and image gallery | Poster-quality first impressions, editorial spacing | Reference |
| [Refero Styles](https://styles.refero.design/) | AI-readable design systems and DESIGN.md examples | Explicit art bible and material/color rules | Reference; original bible |
| [EV Studio](https://evstudio.io/) | Framer/Webflow templates, including film/media portfolio | Useful comparison for conventional template ceiling | Reject templates |
| [Figma](https://www.figma.com/) | Design/prototyping, motion and media workflow products | Can storyboard; no connected tool used | Reference via website |
| [Framer](https://www.framer.com/) | Visual site creation and code overrides | Interaction authoring reference; avoid adding platform dependency | Reference |
| [UI Scanner](https://uiscanner.com/) | Extracts design tokens/structure from public URLs | Directly inspect spacing/type, do not import another identity | Reference; not connected |
| [AI Designer MCP](https://www.aidesigner.ai/docs/mcp) | OAuth MCP design/image/canvas tools, repo initialization instructions | Duplicates available generation and local work | Reference; not installed |
| [Bklit](https://bklit.com/) | Data visualization/chart components | No data visualization in the love story | Reject after inspection |
| [Manus](https://manus.im/) | Agentic research/design/browser tasks | Existing tools already cover task | Reference; not connected |
| [21st.dev](https://21st.dev/) | React component/template registry | Study scale and masking, not page templates | Reference only |
| [React Bits](https://reactbits.dev/) | Animated UI components; client-rendered catalog | Text clipping/parallax techniques; no copied component identity | Reference only |
| [Aceternity](https://ui.aceternity.com/components) | React/Motion components and marketing sections | Foreground/background scroll mechanics | Reference only |
| [Kokonut UI](https://kokonutui.com/) | React/Tailwind/Motion components; text effects and glass cards | Letter disappearance timing, not glass/card visuals | Reference only |
| [Originkit](https://www.originkit.dev/) | Animated component library; client-rendered catalog | Small interactions only; no narrative architecture contribution established | Reference only |
| [Casberry Particles](https://particles.casberry.in/) | 3D particle swarm and gesture simulator | Swarm depth could distribute identifiable petals, but generic particles conflict with brief | Reject runtime |
| [GSAP](https://gsap.com/docs/v3/) | Timeline engine; source cloned | Named timeline beats, deterministic seek | Evaluate; unnecessary for two-scene custom renderer |
| [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | Scroll pinning, scrub, responsive refresh | Native scroll plus one normalized timeline can avoid pin refresh complexity | Reference; no initial dependency |
| [Motion](https://motion.dev/) | Browser/React animation and scroll APIs | Springs good for UI, less necessary for a single film timeline | Reference |
| [Anime.js](https://animejs.com/) | JS timeline and Scroll Observer | Alternate orchestration; adds second animation system | Reference |
| [Lenis](https://lenis.darkroom.engineering/) | Smooth scrolling; cloned MIT repo | Native scroll stays accessible; interpolate visual progress only | Reference, defer |
| [Three.js](https://threejs.org/) | WebGL/WebGPU 3D rendering; cloned MIT repo | True 3D letter field if final sequence needs perspective | Defer until asset need proven |
| [React Three Fiber](https://github.com/pmndrs/react-three-fiber) | React renderer for Three.js; MIT | React state/render overhead not needed for current film stage | Reference; no React dependency |
| [ShaderGradient](https://github.com/ruucm/shadergradient) | Moving gradient renderer and canvas helper | Generic shader backgrounds violate environment requirement; site redirects, repo inspected | Reject visual identity |
| [liquid-glass-js](https://github.com/dashersw/liquid-glass-js) | MIT WebGL refraction/blur/masking | Refraction research for rain only; glass UI inappropriate | Reference; no runtime |
| [Spline](https://spline.design/) | Browser 3D authoring/AI/remix | Potential real paper model; embed is unnecessary for accepted photographic art | Defer |
| [Obscura](https://github.com/h4ckf0r0day/obscura) | Browser automation tooling; Apache-2.0 | Existing browser tools cover inspection; no stealth or bypass needed | Reference; not executed |
| [Composio](https://composio.dev/) | Agent tool integrations | No integration-driven user journey | Reject dependency |
| [Agent Reach](https://github.com/Panniantong/agent-reach) | Agent internet tooling/install and diagnostics; MIT | Existing HTTP/browser access works | Reference; not executed |
| [ScrapeGraphAI](https://github.com/ScrapeGraphAI/Scrapegraph-ai) | LLM-based scraping pipelines | Fixed resource list is simpler with direct fetches | Reference; not installed |
| [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) | Tool directory; MIT | Discovery only, not evidence of available integrations | Reference |
| [no-ai-slop](https://github.com/petergyang/no-ai-slop) | Writing-pattern critique; MIT | Remove formulaic contrast, generic romance slogans | Reference; editorial check |
| [Pear reconstruction](https://github.com/oosuhada/pear.no) | Bundled original art/JS plus rebuilt frame delivery; no top-level license found | Sparse-first frame order, packed delivery, mobile tiers, fallback on cache error | Research only; zero code/art/font reuse |
| [fal Seedance API](https://fal.ai/models/bytedance/seedance-2.0/image-to-video/api) | Documented start/end image-to-video, queue, 4–15s, aspect/resolution choices | Poppy movement, rain, paper folds; credential absent | Prepared workflow, not falsely integrated |
| [fal official example repo](https://github.com/fal-ai/seedance-2.0-api) | Cloned Python/JS/cURL video workflow examples | Explicit start/end frame shot planning; no available credential | Reference |
| [OpenRouter Image API](https://openrouter.ai/docs/guides/overview/multimodal/image-generation) | Current dedicated model and endpoint capability discovery, base64 image output | Three-model original asset bake-off, provenance/cost logging | Use in local scripts only |

## Architecture decision
Vite + semantic static HTML + small original timeline/Canvas renderer. The narrative does not need application state, client routing, a component library, or a React tree updated at scroll frequency. CSS handles type and controls, canvas handles images and transitional masks. Prototype actual frame decode and reverse scroll before committing to a film transport. No service worker for the first slice: it complicates invalidation before a measured need. Keep source artwork out of the public payload; export responsive WebP/AVIF only.

Final film route: OpenRouter's current dedicated [Video API](https://openrouter.ai/docs/guides/overview/multimodal/video-generation) exposed Seedance 2.0 through the existing credential. Six real requests completed. The fal entries above remain research-only; their lack of a separate credential did not block production.
