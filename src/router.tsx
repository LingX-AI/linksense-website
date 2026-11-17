import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    trailingSlash: 'never',
    defaultViewTransition: {
      types: ({ pathChanged }) =>
        pathChanged && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? ['site-navigation']
          : false,
    },
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
