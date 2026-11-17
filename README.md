# LinkSense website

Independent product website built with TanStack Start, React, and Tailwind CSS. The home page introduces the workspace and its deliverables, `/use-cases` shows example workflows, and `/self-hosted` explains deployment and governance. Documentation and the live workspace remain on their existing sites.

## Run locally

Use the Node version in `.node-version` and the pnpm version in `package.json`.

```sh
cd ~/c/linksense-website
eval "$(fnm env --shell zsh)"
fnm use
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://127.0.0.1:18732/](http://127.0.0.1:18732/). English is the default at `/`. The other five locales use `/zh`, `/es`, `/pt`, `/fr`, and `/ja`; switching language keeps the current page. Edit site copy in `src/content/`.

## Verify the production build

```sh
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm test:ssr
NITRO_HOST=127.0.0.1 NITRO_PORT=18733 pnpm start
```

The SSR check starts the built server on a free loopback port and requests each localized page, the English alias, a missing route, and a video byte range. Nitro is pinned to the November 11, 2026 nightly because the tested `3.0.261103-rc` returns `200` for public video range requests; the pin includes [upstream byte-range support](https://github.com/nitrojs/nitro/pull/5065). Move to a release that includes the fix when available and rerun `pnpm test:ssr`.

Local and preview builds use `noindex`. Set `VITE_SITE_URL` to the approved HTTPS origin at build time to emit canonical and alternate-language URLs. Keep the existing documentation routes and legacy redirects on the current site if traffic is later moved to this SSR build.

See [design adaptation and media credits](docs/design-notes.md) and [competitor research](docs/research/website-reference-shortlist-2026-11-16.md).
