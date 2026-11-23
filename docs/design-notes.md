# Design adaptation

The `qclay` preview adapts the public [QClay homepage](https://qclay.design/), inspected on November 23, 2026. LinkSense keeps its own branding, Inter typeface, product claims, first-party footage, and six localized versions.

| Area | LinkSense adaptation |
| --- | --- |
| Hero | Large, left-aligned type and generous space lead into a compact supporting row with the source and self-hosting links. A circular index links down to the film and becomes an inline control on mobile. |
| Film and workspace | A wide original cover with a centered play control precedes the workspace. Each recording opens on demand in the existing native player, with a direct video link if JavaScript is unavailable. The workspace still shows example results, not a live agent. |
| Sections | Pastel case panels and alternating feature images borrow the reference’s editorial rhythm. The closing actions and the existing deployment diagram remain product-specific, and the detail routes keep their existing structure. |
| Header and theme | The desktop navigation is centered, while narrow screens retain the native modal menu. The persisted theme override and system default are unchanged. The cover stays static; the circular controls move only in response to interaction when reduced motion is off. |

## Media

- The header/footer lockups and the app icon come from the LinkSense logo Figma file (`Linksense-logo设计`, node 80:2) and are kept as `public/brand/linksense-lockup-light.svg`, `linksense-lockup-dark.svg` and `linksense-icon.svg`. See the [brand policy](../../linksense/TRADEMARK.md).
- The introduction film is reused from the [existing website's first-party media](../../linksense-site/public/media/README.md). The workspace demo (`product-demo.mp4`), its hover clip, and its poster are a code-built motion reconstruction of the real workspace captures (source project: `~/c/linksense-motion`); the two feature hover loops (`skills-preview.mp4`, `connections-preview.mp4`) come from `~/c/linksense-motion-skills` and `~/c/linksense-motion-connections`. The interfaces are traced from the captures, and all copy comes from the product capture or this site. The demo's score is generated, quiet electronic; the hover loops are silent by design; no spoken dialogue.
- The introduction film has English on-screen text. Its music is **Sonor #2**, Eugenio Mininni, under the [Mixkit Stock Music Free License](https://mixkit.co/license/modal/musicFree/).
- `workspace-result.webp` is a frame from the end of `product-demo.mp4`. `public/media/qclay-reel.svg` is an original vector composition of interlocking links. No QClay assets, copy, or implementation code are used.
- Deliverable illustrations use example data. The previous blue signal artwork (`signal.webp`) and the two square menu artworks are no longer referenced by the current pages.
- The bundled Inter font includes its [OFL license](../public/fonts/Inter-LICENSE.txt).
