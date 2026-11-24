import { describe, expect, it } from 'vitest'
import { elasticPath, expansionProgress, headerShouldHide, routeLift, samePath } from './cuberto'

describe('header visibility', () => {
  it('hides on downward scroll and returns on upward intent, with hysteresis', () => {
    expect(headerShouldHide({ y: 400, lastY: 300, hidden: false, menuOpen: false, focusWithin: false })).toBe(true)
    expect(headerShouldHide({ y: 300, lastY: 400, hidden: true, menuOpen: false, focusWithin: false })).toBe(false)
    expect(headerShouldHide({ y: 400, lastY: 398, hidden: true, menuOpen: false, focusWithin: false })).toBe(true)
    expect(headerShouldHide({ y: 40, lastY: 0, hidden: true, menuOpen: false, focusWithin: false })).toBe(false)
  })

  it('stays visible while the menu is open or focus is inside the header', () => {
    expect(headerShouldHide({ y: 900, lastY: 800, hidden: true, menuOpen: true, focusWithin: false })).toBe(false)
    expect(headerShouldHide({ y: 900, lastY: 800, hidden: true, menuOpen: false, focusWithin: true })).toBe(false)
  })
})

describe('service expansion', () => {
  it('moves from 0 to 1 between the start and end thresholds', () => {
    expect(expansionProgress(1000, 1000)).toBe(0)
    expect(expansionProgress(920, 1000)).toBe(0)
    expect(expansionProgress(710, 1000)).toBeCloseTo(0.5)
    expect(expansionProgress(500, 1000)).toBeCloseTo(1)
    expect(expansionProgress(0, 1000)).toBe(1)
  })
})

describe('elastic rule geometry', () => {
  it('anchors both ends on the mid line and bends through the control point', () => {
    expect(elasticPath(600, 40, 120, 12)).toBe('M0 20 Q 120 12 600 20')
  })

  it('switches the outgoing lift between landscape and portrait', () => {
    expect(routeLift(1440, 1000)).toBe('-10vh')
    expect(routeLift(390, 844)).toBe('-5vh')
  })

  it('treats a hash-only change as the same document path', () => {
    expect(samePath({ pathname: '/use-cases' }, { pathname: '/use-cases', search: '' })).toBe(true)
    expect(samePath({ pathname: '/use-cases' }, { pathname: '/self-hosted' })).toBe(false)
    expect(samePath({ pathname: '/', search: '?a=1' }, { pathname: '/', search: '?a=2' })).toBe(false)
  })
})
