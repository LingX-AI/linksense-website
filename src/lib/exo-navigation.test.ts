import { describe, expect, it } from 'vitest'
import {
  isCompactScroll, isHomePathname, menuCloseDuration, menuPageOrigin, normalizePathname, shouldAnimatePath,
} from './exo-navigation'
import { locales, sitePath } from './site'

describe('Exo chrome path helpers', () => {
  it('normalizes empty, root and trailing-slash pathnames', () => {
    expect(normalizePathname('')).toBe('/')
    expect(normalizePathname('/')).toBe('/')
    expect(normalizePathname('///')).toBe('/')
    expect(normalizePathname('/zh/')).toBe('/zh')
    expect(normalizePathname('/zh/use-cases/')).toBe('/zh/use-cases')
  })

  it('treats only the root and locale roots as home', () => {
    expect(isHomePathname('/')).toBe(true)
    expect(isHomePathname('')).toBe(true)
    expect(isHomePathname('/zh/')).toBe(true)
    for (const locale of locales) expect(isHomePathname(sitePath('home', locale))).toBe(true)
    expect(isHomePathname('/use-cases')).toBe(false)
    expect(isHomePathname('/zh/use-cases')).toBe(false)
    expect(isHomePathname('/not-a-locale')).toBe(false)
    expect(isHomePathname('/fr/self-hosted')).toBe(false)
  })

  it('animates page or locale moves but not same-route hashes or slash-only changes', () => {
    expect(shouldAnimatePath('/', '/use-cases')).toBe(true)
    expect(shouldAnimatePath('/zh', '/zh/self-hosted')).toBe(true)
    expect(shouldAnimatePath('/fr/use-cases', '/ja/use-cases')).toBe(true)
    expect(shouldAnimatePath('/zh', '/zh/')).toBe(false)
    expect(shouldAnimatePath('/use-cases', '/use-cases/')).toBe(false)
  })

  it('compacts after half the viewport, not at the threshold itself', () => {
    expect(isCompactScroll(0, 900)).toBe(false)
    expect(isCompactScroll(450, 900)).toBe(false)
    expect(isCompactScroll(451, 900)).toBe(true)
    expect(isCompactScroll(200, 0)).toBe(true)
    expect(isCompactScroll(50, -100)).toBe(true)
  })

  it('skips the menu close hold for reduced motion or missing clip-path support', () => {
    expect(menuCloseDuration(true, true)).toBe(0)
    expect(menuCloseDuration(false, false)).toBe(0)
    expect(menuCloseDuration(false, true)).toBe(1000)
  })

  it('places the menu counter-motion origin near the viewport midpoint inside the page', () => {
    expect(menuPageOrigin(82, 5000, 900)).toBe(368)
    expect(menuPageOrigin(-4918, 6000, 900)).toBe(5368)
    expect(menuPageOrigin(1000, 5000, 900)).toBe(0)
    expect(menuPageOrigin(0, 300, 900)).toBe(300)
  })
})
