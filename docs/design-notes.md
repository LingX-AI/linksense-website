# Design adaptation

The marketing site takes its visual direction from the public [OpenBot homepage](https://open.bot/), inspected on November 19, 2026. This replaces the earlier Exo Ape and Raycast direction. LinkSense retains its own branding, Inter typeface, media, product claims, and localized routes.

| Area | LinkSense adaptation |
| --- | --- |
| Hero | The capped desktop grid, compact capability strip, open-source link and paired primary actions follow the reference’s hierarchy. The full-width background uses the React Bits [GradientWaves](https://reactbits.dev/backgrounds/gradient-waves) canvas with a violet palette and light/dark variants. The right-hand art column was removed so the copy sits over the waves. The canvas stops out of view or in a hidden tab, and stays still with reduced motion. The competitors remain in the supporting copy rather than taking up extra heading lines. |
| Workspace | A full-width, chrome-free preview shows the procurement task progressing to its deliverables. The muted 4.75-second preview plays once in view, pauses offscreen or in a hidden tab, and leaves a still when reduced motion is on or autoplay fails. The walkthrough link opens the full native player. The preview is a recording, not an embedded or simulated agent workspace. |
| Sections | Split headings, alternating feature-image rows, a theme-aware introduction film (white in light mode, aubergine in dark), and a centered closing section replace the draft’s repeated card layout. The deployment diagram and controls are shared by the homepage and self-hosting. |
| Header and theme | Sticky navigation is right aligned on desktop and becomes a native modal menu on narrow screens. The scheme follows the system by default; a 44px toggle persists an explicit override. Older browsers without `light-dark()` retain the light presentation. |

## Media

- The header/footer lockups and the app icon come from the LinkSense logo Figma file (`Linksense-logo设计`, node 80:2) and are kept as `public/brand/linksense-lockup-light.svg`, `linksense-lockup-dark.svg` and `linksense-icon.svg`. See the [brand policy](../../linksense/TRADEMARK.md).
- The introduction film is reused from the [existing website's first-party media](../../linksense-site/public/media/README.md). The workspace demo (`product-demo.mp4`), its hover clip, and its poster are a code-built motion reconstruction of the real workspace captures (source project: `~/c/linksense-motion`); the two feature hover loops (`skills-preview.mp4`, `connections-preview.mp4`) come from `~/c/linksense-motion-skills` and `~/c/linksense-motion-connections`. The interfaces are traced from the captures, and all copy comes from the product capture or this site. The demo's score is generated, quiet electronic; the hover loops are silent by design; no spoken dialogue.
- The introduction film has English on-screen text. Its music is **Sonor #2**, Eugenio Mininni, under the [Mixkit Stock Music Free License](https://mixkit.co/license/modal/musicFree/).
- `workspace-teaser.mp4` is a shortened, silent version of `workspace-preview.mp4`; `workspace-result.webp` is a frame from the end of `product-demo.mp4`. The hero background is the vendored GradientWaves canvas from the React Bits registry, recolored for LinkSense. It is kept as JavaScript with a local type declaration; the shader itself is not type-checked. No OpenBot images or client code are shipped.
- Deliverable illustrations use example data. The previous blue signal artwork (`signal.webp`) and the two square menu artworks are no longer referenced by the current pages.
- The bundled Inter font includes its [OFL license](../public/fonts/Inter-LICENSE.txt).
