# Design adaptation

[Exo Ape](https://www.exoape.com/) remains the main reference for masked type, asymmetrical media, the expanding reel, and slanted transitions. [Raycast](https://www.raycast.com/) informs the centered launch composition, floating navigation, rounded controls, and layered product frame. LinkSense keeps its own blue signal artwork, colors, and recordings.

The revised homepage moves from the workspace and sample files to everyday workflows, then to shared methods, connected tools, and self-hosting. [Eigent](https://www.eigent.ai/) informed putting the workspace front and center; [WorkBuddy](https://cloud.tencent.com/product/workbuddy) and [Manus](https://manus.im/features) informed the task and deliverable framing. [Kortix](https://kortix.com/) informed how the site connects team capabilities with deployment, and [Dify](https://dify.ai/) informed keeping the self-hosted evaluation path separate. See the [competitor research](research/official-product-references-2026-11-16.md) and the [LinkSense README](../../linksense/README.md) for product claims. The sample procurement deliverables sit beside a separate workspace overview recording, not a recording of the procurement example.

| Element | Adaptation and fallback |
| --- | --- |
| Hero and headings | Separate tilted line masks on the title and the introduction. Hero art moves on scroll where supported. Text and art remain available without scripts or motion. No timed loading screen. |
| Workspace and feature panels | The full workspace frame sits beside an example task on wide screens and stacks above it on narrow screens. Two offset feature panels show Skills and connectors. Pointer previews use recorded clips with a still-image fallback. Rounded corners work without `corner-shape`; browsers that support it get a squircle on selected surfaces. |
| Reel | A desktop scroll view timeline widens the film while the title converges. The smaller mobile composition still has an explicit play link. The dialog uses native video controls; the direct MP4 link works without scripting. |
| Menu | A diagonal clip and opposed page transforms open and close around a native modal dialog. Menu links keep the overlay open until TanStack Router reports the destination rendered, then reveal that page with the menu exit. Language links use the same handoff. Escape and selecting the current page close normally and return focus to the menu button. |
| Navigation | Ordinary links use TanStack Router view snapshots to rotate out the old page while the incoming page is clipped diagonally. Menu links disable that second transition because the menu exit already reveals the destination. Focus moves to the new main content after the dialog closes. Browser history stays with the router. |

Native scrolling replaces the reference's custom scroll controller. The pointer remains visible. Scroll decoration is optional where scroll timelines are unsupported; reduced-motion mode uses static content and direct navigation. The original studio portfolio, auto-next projects, and editorial pages are outside this product site's scope.

## Media

- The LinkSense lockup and icon are existing product brand assets. See the [brand policy](../../linksense/TRADEMARK.md).
- The introduction film is reused from the [existing website's first-party media](../../linksense-site/public/media/README.md). The workspace demo (`product-demo.mp4`), its hover clip, and its poster are a code-built motion reconstruction of the real workspace captures (source project: `~/c/linksense-motion`); the two feature hover loops (`skills-preview.mp4`, `connections-preview.mp4`) come from `~/c/linksense-motion-skills` and `~/c/linksense-motion-connections`. The interfaces are traced from the captures, and all copy comes from the product capture or this site. The demo's score is generated, quiet electronic; the hover loops are silent by design; no spoken dialogue.
- The introduction film has English on-screen text. Its music is **Sonor #2**, Eugenio Mininni, under the [Mixkit Stock Music Free License](https://mixkit.co/license/modal/musicFree/).
- The blue signal artwork was created for this site. `node scripts/signal-art.mjs` emits its SVG source; `signal.webp` is the web rendition. The menu's two page artworks (`menu-use-cases.webp`, `menu-self-hosted.webp`, 1:1) were generated for this site in the same dark-navy/blue palette; they carry no product claims or readable text. Deliverable illustrations use example data. No Raycast or Exo Ape artwork, fonts, or site code is bundled.
- The bundled Inter font includes its [OFL license](../public/fonts/Inter-LICENSE.txt).

Browser checks used desktop and 390px Codex previews, including opening and closing menu frames, route navigation and back, a language change, reduced motion, and opening and closing the product film. These do not establish real-device Safari behavior or frame-for-frame parity with the reference.
