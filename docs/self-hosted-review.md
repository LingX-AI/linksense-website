# Self-hosted page review

Date: 2026-11-20. Scope: `/self-hosted` and its localized routes. Mode: Persuade. Homepage, use-case design and global navigation remain outside this change.

## Design contract

- Keep the confirmed LinkSense blue/white identity, bundled Inter, product copy and link destinations.
- Use the homepage opening type scale exactly: CJK H1 up to 48px, Latin up to 50.4px; shared H2 40px desktop / 28px mobile; supporting headings 18px and body 16px.
- Replace the old blue slab and dashed deployment enclosure with a white deployment boundary, a shallow blue backing plane, explicit internal connectivity and an external black model endpoint. No repeated brand logo.
- Keep Core and Full visible together on desktop; align documentation actions and show the existing Core-plus-knowledge relationship without adding capability claims.
- Align management controls and the runtime-boundary explanation; use the homepage chapter spacing: 80px / 64px / 56px.

## Impeccable checks

- Layout detector: no findings in the new component and stylesheet.
- Semantic H1/H2/H3 structure, named sections, native links and existing visible keyboard focus retained. Architecture uses localized text rather than text baked into an image.
- Desktop and phone screenshots inspected, including dark mode. The sampled rendered dark-theme text meets 4.5:1 contrast. Existing semantic theme tokens style every general surface and text role; the black model node has an explicit light foreground.
- Rendered widths 320, 375, 414, 768 and 1440 have no horizontal overflow. Every page action is at least 44px tall. French, English and Japanese also checked at 320px with no overflow or undersized actions.
- Compare action scrolls to its matching section. Deployment and security links retain their original localized destinations.
- Connection drawing is a single 800ms CSS/SVG enhancement under no-preference only; reduced-motion gets the complete static diagram. No new package, raster asset or continuous animation.
- Build, TypeScript and ESLint pass. All 18 localized pages pass the built-server SSR checks. The existing main-bundle size warning is unchanged and does not block this page.

## Scope verification

All visual rules are scoped to the self-hosted component or its unique classes. No homepage component, shared type rule or global navigation rule was edited. The old HostingPage export now forwards to the dedicated implementation; the concurrently edited CasesPage export is preserved.
