# Design adaptation

The `bit` preview takes its visual direction from the public [React Bits homepage](https://reactbits.dev/), inspected on November 23, 2026. It uses the reference's left-aligned introduction, compact floating navigation, and framed violet product stage, not its copy, brand, or product interface. LinkSense retains its own branding, Inter typeface, product media, claims, and localized routes.

| Area | LinkSense adaptation |
| --- | --- |
| Hero | A source link and headline lead on the left, with the product explanation and self-hosting link beside them. The existing competitor positioning remains in the supporting copy. Copy and actions stack before the stage on narrow screens. |
| Workspace | [Gradient Waves](https://reactbits.dev/backgrounds/gradient-waves) sits behind three panels: the LinkSense workspace, the example task, and its file deliverables. The still is present in the initial HTML; the full recording opens on demand. The violet CSS background remains without WebGL or with reduced motion. A visible control pauses the running shader, which also stops out of view or in a hidden tab. |
| Detail introductions | Both detail routes continue the homepage split lead: left-aligned display type, a source or example-data chip, the supporting claim at the right, and a soft violet glow. The use-cases chip jumps to the examples; the self-hosted chip opens the GitHub source. |
| Use cases | The former paper bands become three violet-framed stages. Each pairs an audience chip and readable copy with a distinct inspector: a document preview, a numbered brief, or a question with its reference. Capability sharing is a framed product stage with the team-app still, not a separate soft band. |
| Self-hosted | Core and Full sit as technical window panels inside one comparison stage, with aligned platform and deployment-guide links. Governance uses the same stage language: the deployment diagram, access controls, data-boundary note, and security link share one violet surface. The diagram is reused unchanged on the homepage. |
| Sections | The grid of use cases leads into two paired capability panels, the introduction film, and the existing self-hosting and governance material. No preview implies access to a live workspace. |
| Header and theme | The rounded, translucent sticky header retains the existing mobile modal menu. The scheme follows the system by default; a 44px toggle persists an explicit override. Older browsers without `light-dark()` retain the light presentation. |

## Media

- The header/footer lockups and the app icon come from the LinkSense logo Figma file (`Linksense-logo设计`, node 80:2) and are kept as `public/brand/linksense-lockup-light.svg`, `linksense-lockup-dark.svg` and `linksense-icon.svg`. See the [brand policy](../../linksense/TRADEMARK.md).
- The introduction film is reused from the [existing website's first-party media](../../linksense-site/public/media/README.md). The workspace demo (`product-demo.mp4`), its hover clip, and its poster are a code-built motion reconstruction of the real workspace captures (source project: `~/c/linksense-motion`); the two feature hover loops (`skills-preview.mp4`, `connections-preview.mp4`) come from `~/c/linksense-motion-skills` and `~/c/linksense-motion-connections`. The interfaces are traced from the captures, and all copy comes from the product capture or this site. The demo's score is generated, quiet electronic; the hover loops are silent by design; no spoken dialogue.
- The introduction film has English on-screen text. Its music is **Sonor #2**, Eugenio Mininni, under the [Mixkit Stock Music Free License](https://mixkit.co/license/modal/musicFree/).
- `workspace-result.webp` is a frame from the end of `product-demo.mp4`. The stage uses the existing vendored GradientWaves canvas from the React Bits registry, recolored for LinkSense. It is kept as JavaScript with a local type declaration; the shader itself is not type-checked. No React Bits marketing assets are shipped.
- Deliverable illustrations use example data. The previous blue signal artwork (`signal.webp`) and the two square menu artworks are no longer referenced by the current pages.
- The bundled Inter font includes its [OFL license](../public/fonts/Inter-LICENSE.txt).
