import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    trailingSlash: 'never',
    // Native same-document View Transitions are opted into per link in
    // `SiteLink` for real path/locale moves only. Back/Forward keeps the
    // router's plain history restoration, and same-route hashes do not wipe.
    defaultViewTransition: false,
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
