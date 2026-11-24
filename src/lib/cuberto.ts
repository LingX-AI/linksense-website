/** Small pure helpers behind the Cuberto-style motion system. */

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Header hides while scrolling down past the threshold and returns on any
 * upward intent. Menu open or keyboard focus inside the header pins it open.
 */
export function headerShouldHide(input: {
  y: number
  lastY: number
  hidden: boolean
  menuOpen: boolean
  focusWithin: boolean
  threshold?: number
  hysteresis?: number
}): boolean {
  const { y, lastY, hidden, menuOpen, focusWithin, threshold = 96, hysteresis = 6 } = input
  if (menuOpen || focusWithin) return false
  if (y < threshold) return false
  const delta = y - lastY
  if (Math.abs(delta) < hysteresis) return hidden
  return delta > 0
}

/**
 * Cuberto expands service cards as their top travels between 92% and 50% of the
 * viewport. Progress is clamped so the card state stays stable at both ends.
 */
export function expansionProgress(top: number, viewportHeight: number, start = 0.92, end = 0.5): number {
  const distance = viewportHeight * (start - end)
  if (distance <= 0) return 1
  return clamp((viewportHeight * start - top) / distance)
}

/** Local-coordinate quadratic used by the elastic rule. */
export function elasticPath(width: number, height: number, controlX: number, controlY: number): string {
  const mid = height / 2
  return `M0 ${mid} Q ${controlX} ${controlY} ${width} ${mid}`
}

/** Same-document path comparison that ignores the hash. */
export function samePath(a: { pathname: string; search?: string }, b: { pathname: string; search?: string }): boolean {
  return a.pathname === b.pathname && (a.search ?? '') === (b.search ?? '')
}

/** Landing direction for the outgoing page lift. */
export function routeLift(viewportWidth: number, viewportHeight: number): string {
  return viewportWidth > viewportHeight ? '-10vh' : '-5vh'
}
