export const introSessionKey = 'linksense-intro-seen'
export const introActiveClass = 'exo-intro-active'
export const introDoneClass = 'exo-intro-skip'

/** The glyph fill, a short hold, then the slanted curtain reveal. */
export const introMinVisibleMs = 900
export const introExitMs = 1000
/** If React never hydrates, the pre-paint script still clears the curtain. */
export const introSafetyMs = 2600

/**
 * The intro is a first-visit cue per tab session, never a gate. Reduced
 * motion, a previous visit, or unavailable storage skips it entirely.
 */
export function introShouldPlay(seen: boolean, reducedMotion: boolean): boolean {
  return !seen && !reducedMotion
}

/**
 * Remaining hold after elapsed time. A tab that was backgrounded past the
 * cue budget releases immediately instead of replaying it on return.
 */
export function introVisibleRemaining(startedAt: number, now: number): number {
  return Math.max(0, introMinVisibleMs - Math.max(0, now - startedAt))
}

/** DOM removal waits for the curtain slide; reduced motion or missing CSS closes now. */
export function introExitDuration(reducedMotion: boolean, supportsAnimation: boolean): number {
  return reducedMotion || !supportsAnimation ? 0 : introExitMs + 60
}

/**
 * Inline, pre-paint boot script. It only marks the tab session and adds the
 * classes; CSS owns the visible curtain and the failsafe timeout, so a failed
 * hydration or a missing asset cannot leave the document hidden.
 */
export function introBootScript(): string {
  return `(function(){var r=document.documentElement;try{var s=window.sessionStorage;if(s.getItem('${introSessionKey}')==='1'){r.classList.add('${introDoneClass}');return}s.setItem('${introSessionKey}','1');if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){r.classList.add('${introDoneClass}');return}}catch(e){r.classList.add('${introDoneClass}');return}var t=window.performance&&performance.now?performance.now():Date.now();r.dataset.exoIntroStarted=String(t);r.classList.add('${introActiveClass}');window.setTimeout(function(){r.classList.add('${introDoneClass}')},${introSafetyMs})})()`
}
