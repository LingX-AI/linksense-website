import { describe, expect, it } from 'vitest'
import {
  introActiveClass, introBootScript, introDoneClass, introExitDuration, introMinVisibleMs,
  introSafetyMs, introSessionKey, introShouldPlay, introVisibleRemaining,
} from './first-visit'

describe('first-visit intro decisions', () => {
  it('plays only on a first visit with motion allowed', () => {
    expect(introShouldPlay(false, false)).toBe(true)
    expect(introShouldPlay(true, false)).toBe(false)
    expect(introShouldPlay(false, true)).toBe(false)
    expect(introShouldPlay(true, true)).toBe(false)
  })

  it('releases immediately once the brief cue budget has elapsed', () => {
    expect(introVisibleRemaining(1_000, 1_000)).toBe(introMinVisibleMs)
    expect(introVisibleRemaining(1_000, 1_500)).toBe(400)
    expect(introVisibleRemaining(1_000, 1_900)).toBe(0)
    expect(introVisibleRemaining(1_000, 9_000)).toBe(0)
    // A clock that moves backwards cannot extend the hold.
    expect(introVisibleRemaining(1_000, 900)).toBe(introMinVisibleMs)
  })

  it('closes without the exit hold for reduced motion or missing animation support', () => {
    expect(introExitDuration(false, true)).toBeGreaterThan(0)
    expect(introExitDuration(true, true)).toBe(0)
    expect(introExitDuration(false, false)).toBe(0)
    expect(introExitDuration(true, false)).toBe(0)
  })

  it('boots the session marker, active class and absolute failsafe', () => {
    const script = introBootScript()
    expect(script).toContain(introSessionKey)
    expect(script).toContain(introActiveClass)
    expect(script).toContain(introDoneClass)
    expect(script).toContain(String(introSafetyMs))
    expect(script).toContain('prefers-reduced-motion: reduce')
    expect(script).not.toContain('</script')
  })
})
