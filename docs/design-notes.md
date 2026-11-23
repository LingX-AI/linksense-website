# Design adaptation

The `exoape` preview takes its visual direction from the [Exo Ape homepage](https://www.exoape.com/), using the Bryce Nice Site Creator profile and its October 16, 2026 REA evidence. LinkSense retains its own brand, Inter typeface, product copy, first-party product media, and six localized versions of its three pages.

| Area | LinkSense adaptation |
| --- | --- |
| Hero | An original full-bleed waterfront scene frames the thin display type. Titles and supporting copy enter in staggered, tilted masks without a preloader. The image drifts with native scroll where supported; portrait layouts crop toward the tower. |
| Workspace | An asymmetric, four-panel showcase keeps product captions visible. The muted procurement preview plays once in view; the skills and connections previews play on mouse hover. The full walkthrough opens in a native player with a direct video fallback. |
| Reel and sections | The dark introduction reel pins on sufficiently wide and tall screens with scroll-timeline support: the still expands and two title lines converge separately. The play link stays usable. Smaller viewports and reduced motion use the static layout. The localized use-case index, governance details, and final call to action follow the reel. |
| Detail pages | The use cases use numbered editorial spreads with differently composed product stills, illustrative outputs, and a dark sharing feature. Self-hosting uses a staggered Core/Full comparison and a dark deployment and security spread. Both keep the existing fragment destinations. |
| Navigation and theme | The desktop header overlays the hero and becomes compact on scroll; narrow screens can open the menu at any point. The native dialog reveals diagonally in both directions and swaps its preview art on hover or focus. Same-document link transitions use the browser's native snapshots where supported. Back/Forward keeps normal restoration; reduced motion skips the cinematic transitions. Theme selection follows the system unless explicitly overridden. |

These are adaptations, not a frame-for-frame remake: there is no virtual scroll controller, custom cursor, or extra studio, project, or news routes.

## Media

- The header/footer lockups and the app icon come from the LinkSense logo Figma file (`Linksense-logo设计`, node 80:2) and are kept as `public/brand/linksense-lockup-light.svg`, `linksense-lockup-dark.svg` and `linksense-icon.svg`. See the [brand policy](../../linksense/TRADEMARK.md).
- The introduction film is reused from the [existing website's first-party media](../../linksense-site/public/media/README.md). The workspace demo (`product-demo.mp4`), its hover clip, and its poster are a code-built motion reconstruction of the real workspace captures (source project: `~/c/linksense-motion`); the two feature hover loops (`skills-preview.mp4`, `connections-preview.mp4`) come from `~/c/linksense-motion-skills` and `~/c/linksense-motion-connections`. The interfaces are traced from the captures, and all copy comes from the product capture or this site. The demo's score is generated, quiet electronic; the hover loops are silent by design; no spoken dialogue.
- The introduction film has English on-screen text. Its music is **Sonor #2**, Eugenio Mininni, under the [Mixkit Stock Music Free License](https://mixkit.co/license/modal/musicFree/).
- `workspace-teaser.mp4` is a shortened, silent version of `workspace-preview.mp4`; `workspace-result.webp` is a frame from the end of `product-demo.mp4`. `public/media/exoape-hero.webp` is an original procedural rendering for this preview; it does not reuse Exo Ape's photography or code.
- Deliverable illustrations use example data. The full-screen menu reuses LinkSense's workspace still and two existing square menu artworks.
- The bundled Inter font includes its [OFL license](../public/fonts/Inter-LICENSE.txt).
