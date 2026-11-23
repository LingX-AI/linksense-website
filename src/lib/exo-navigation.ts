import { locales } from './site'

/**
 * Normalizes a router pathname so path-only decisions are not affected by a
 * trailing slash (the router is configured with `trailingSlash: 'never'`, but
 * hand-written links and browser history can still supply one).
 */
export function normalizePathname(pathname: string): string {
  const trimmed = pathname.trim()
  if (!trimmed || trimmed === '/') return '/'
  const withoutTrailing = trimmed.replace(/\/+$/, '')
  return withoutTrailing === '' ? '/' : withoutTrailing
}

const homePaths = new Set<string>(['/', ...locales.map((locale) => `/${locale}`)])

/** Home is `/` or a locale root such as `/zh`, never a nested page. */
export function isHomePathname(pathname: string): boolean {
  return homePaths.has(normalizePathname(pathname))
}

/**
 * Native view transitions are opt-in for real path/locale moves. Same-route
 * hashes and Back/Forward deliberately keep the router's plain navigation.
 */
export function shouldAnimatePath(fromPathname: string, toPathname: string): boolean {
  return normalizePathname(fromPathname) !== normalizePathname(toPathname)
}

/** Compact chrome appears once the page has scrolled about half a viewport. */
export function isCompactScroll(scrollY: number, viewportHeight: number): boolean {
  return scrollY > Math.max(0, viewportHeight) / 2
}

/**
 * Menu counter-motion uses a viewport-midpoint origin expressed inside the
 * page box, so long pages do not rotate around their offscreen document middle.
 */
export function menuPageOrigin(pageTop: number, pageHeight: number, viewportHeight: number): number {
  const midpoint = viewportHeight / 2 - pageTop
  return Math.min(Math.max(0, pageHeight), Math.max(0, midpoint))
}

/**
 * Closing the menu stays open long enough for the clip transition to finish,
 * but reduced-motion and browsers without `clip-path` transitions close
 * immediately instead of holding an invisible modal open.
 */
export function menuCloseDuration(reducedMotion: boolean, supportsClipPath: boolean): number {
  return reducedMotion || !supportsClipPath ? 0 : 1000
}
