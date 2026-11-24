import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { animateMini } from 'motion/react'
import { setupMotionAccent, type MotionAccentStep } from './motion-accent'

vi.mock('motion/react', () => ({ animateMini: vi.fn() }))

type FakeElement = HTMLElement & { style: { transform: string } }
type ObserverCallback = (entries: IntersectionObserverEntry[]) => void
type AnimateCall = {
  element: FakeElement
  keyframes: { transform: string[] }
  options: { duration: number; delay: number; onComplete: () => void }
}

const visibleRatio = 0.2
const animateMock = vi.mocked(animateMini)
let calls: AnimateCall[] = []
let controls: Array<{ cancel: ReturnType<typeof vi.fn> }> = []

function element(transform = '') {
  return { style: { transform } } as unknown as FakeElement
}

function root(elements: Record<string, FakeElement[]>) {
  return {
    querySelectorAll: (selector: string) => elements[selector] ?? [],
  } as unknown as HTMLElement
}

function intersection(ratio: number, isIntersecting = true) {
  return { isIntersecting, intersectionRatio: ratio } as IntersectionObserverEntry
}

function installAnimation() {
  animateMock.mockImplementation((target, keyframes, options) => {
    calls.push({
      element: target as FakeElement,
      keyframes: keyframes as unknown as { transform: string[] },
      options: options as unknown as AnimateCall['options'],
    })
    const control = { cancel: vi.fn() }
    controls.push(control)
    return control as unknown as ReturnType<typeof animateMini>
  })
}

function installBrowser({
  reduced = false,
  waapi = true,
  intersector = true,
  canWatch = true,
}: {
  reduced?: boolean
  waapi?: boolean
  intersector?: boolean
  canWatch?: boolean
} = {}) {
  let callback: ObserverCallback | undefined
  let listener: (() => void) | undefined
  const disconnect = vi.fn()
  const observe = vi.fn()
  const addEventListener = vi.fn((_event: string, next: () => void) => {
    listener = next
  })
  const removeEventListener = vi.fn()
  const query = {
    matches: !reduced,
    addEventListener: canWatch ? addEventListener : undefined,
    removeEventListener: canWatch ? removeEventListener : undefined,
  }
  const matchMedia = vi.fn(() => query)
  const observer = vi.fn(class {
    observe = observe
    disconnect = disconnect

    constructor(next: ObserverCallback) {
      callback = next
    }
  })

  class FakeElementWithWaapi {
    animate() {}
  }

  class FakeElementWithoutWaapi {}

  vi.stubGlobal('window', { matchMedia })
  if (intersector) vi.stubGlobal('IntersectionObserver', observer)
  vi.stubGlobal('Element', waapi ? FakeElementWithWaapi : FakeElementWithoutWaapi)

  return {
    matchMedia,
    observer,
    observe,
    disconnect,
    addEventListener,
    removeEventListener,
    emit(entries: IntersectionObserverEntry[]) {
      callback?.(entries)
    },
    change() {
      listener?.()
    },
    setReduced(value: boolean) {
      query.matches = !value
    },
  }
}

const panelSteps: readonly MotionAccentStep[] = [
  { selector: '.panel', from: 'translateY(9px)', duration: 0.34, stagger: 0.06 },
]

describe('motion accent playback', () => {
  beforeEach(() => {
    calls = []
    controls = []
    animateMock.mockReset()
    installAnimation()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('stages targeted transforms and clears the completed inline value only', () => {
    const panels = [element(), element(), element()]
    const browser = installBrowser()
    const stop = setupMotionAccent(root({ '.panel': panels }), panelSteps)

    browser.emit([intersection(visibleRatio)])

    expect(calls.map((call) => call.options.delay)).toEqual([0, 0.06, 0.12])
    expect(calls.every((call) => call.options.duration === 0.34)).toBe(true)
    expect(calls[0]?.keyframes.transform).toEqual(['translateY(9px)', 'none'])

    const first = calls[0]
    const second = calls[1]
    expect(first).toBeDefined()
    expect(second).toBeDefined()
    if (!first || !second) return

    first.element.style.transform = 'none'
    second.element.style.transform = 'translateX(3px)'
    first.options.onComplete()

    expect(first.element.style.transform).toBe('')
    expect(second.element.style.transform).toBe('translateX(3px)')

    stop()

    expect(controls.every((control) => control.cancel.mock.calls.length === 1)).toBe(true)
    expect(second.element.style.transform).toBe('translateX(3px)')
  })
})

describe('motion accent lifecycle', () => {
  beforeEach(() => {
    calls = []
    controls = []
    animateMock.mockReset()
    installAnimation()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('leaves a static page when Web Animations is missing', () => {
    const browser = installBrowser({ waapi: false })
    const stop = setupMotionAccent(root({ '.panel': [element()] }), panelSteps)

    browser.emit([intersection(1)])

    expect(browser.matchMedia).not.toHaveBeenCalled()
    expect(browser.observer).not.toHaveBeenCalled()
    expect(browser.observe).not.toHaveBeenCalled()
    expect(animateMock).not.toHaveBeenCalled()
    stop()
  })

  it('leaves a static page when IntersectionObserver is missing', () => {
    const browser = installBrowser({ intersector: false })
    const stop = setupMotionAccent(root({ '.panel': [element()] }), panelSteps)

    expect(browser.matchMedia).not.toHaveBeenCalled()
    expect(animateMock).not.toHaveBeenCalled()
    stop()
  })

  it('does nothing when reduced motion is already enabled', () => {
    const browser = installBrowser({ reduced: true })
    const stop = setupMotionAccent(root({ '.panel': [element()] }), panelSteps)

    expect(browser.observer).not.toHaveBeenCalled()
    expect(browser.observe).not.toHaveBeenCalled()
    expect(browser.addEventListener).not.toHaveBeenCalled()
    expect(animateMock).not.toHaveBeenCalled()
    stop()
  })

  it('does nothing without matchMedia change listeners', () => {
    const browser = installBrowser({ canWatch: false })
    const stop = setupMotionAccent(root({ '.panel': [element()] }), panelSteps)

    expect(browser.observer).not.toHaveBeenCalled()
    expect(browser.observe).not.toHaveBeenCalled()
    expect(animateMock).not.toHaveBeenCalled()
    stop()
  })

  it('ignores an initial intersection below the visible ratio', () => {
    const browser = installBrowser()
    const stop = setupMotionAccent(root({ '.panel': [element()] }), panelSteps)

    browser.emit([intersection(0.1)])
    browser.emit([intersection(0.19)])

    expect(animateMock).not.toHaveBeenCalled()
    expect(browser.disconnect).not.toHaveBeenCalled()

    browser.emit([intersection(visibleRatio)])

    expect(animateMock).toHaveBeenCalledTimes(1)
    expect(browser.disconnect).toHaveBeenCalledTimes(1)
    stop()
  })

  it('plays once on a meaningful intersection and ignores later callbacks', () => {
    const browser = installBrowser()
    const stop = setupMotionAccent(root({ '.panel': [element()] }), panelSteps)

    browser.emit([intersection(1)])
    browser.emit([intersection(1)])
    browser.change()

    expect(animateMock).toHaveBeenCalledTimes(1)
    expect(browser.disconnect).toHaveBeenCalledTimes(1)
    expect(browser.removeEventListener).not.toHaveBeenCalled()

    stop()

    expect(browser.disconnect).toHaveBeenCalledTimes(1)
    expect(browser.removeEventListener).toHaveBeenCalledTimes(1)
  })

  it('disconnects before triggering and ignores a queued observer callback', () => {
    const browser = installBrowser()
    const stop = setupMotionAccent(root({ '.panel': [element()] }), panelSteps)

    stop()
    browser.emit([intersection(1)])

    expect(animateMock).not.toHaveBeenCalled()
    expect(browser.disconnect).toHaveBeenCalledTimes(1)
    expect(browser.removeEventListener).toHaveBeenCalledTimes(1)
  })

  it('cancels playback on unmount', () => {
    const browser = installBrowser()
    const stop = setupMotionAccent(root({ '.panel': [element()] }), panelSteps)

    browser.emit([intersection(1)])
    stop()

    expect(controls[0]?.cancel).toHaveBeenCalledTimes(1)
    expect(browser.disconnect).toHaveBeenCalledTimes(1)
    expect(browser.removeEventListener).toHaveBeenCalledTimes(1)
  })

  it('cancels and stops watching when reduced motion changes mid-play', () => {
    const browser = installBrowser()
    const stop = setupMotionAccent(root({ '.panel': [element()] }), panelSteps)

    browser.emit([intersection(1)])
    expect(controls[0]?.cancel).not.toHaveBeenCalled()

    browser.setReduced(true)
    browser.change()

    expect(controls[0]?.cancel).toHaveBeenCalledTimes(1)
    expect(browser.disconnect).toHaveBeenCalledTimes(1)
    expect(browser.removeEventListener).toHaveBeenCalledTimes(1)

    browser.emit([intersection(1)])
    browser.change()
    expect(animateMock).toHaveBeenCalledTimes(1)
    expect(controls[0]?.cancel).toHaveBeenCalledTimes(1)

    stop()
    expect(controls[0]?.cancel).toHaveBeenCalledTimes(1)
  })
})
