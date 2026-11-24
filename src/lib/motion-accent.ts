import { useEffect, type RefObject } from 'react'
import { animateMini } from 'motion/react'

export type MotionAccentStep = {
  selector: string
  from: string
  duration?: number
  delay?: number
  stagger?: number
}

type MotionAccentRoot = HTMLElement
type MotionAccentControls = { cancel: () => void }

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]
const visibleRatio = 0.2

function supportsMotionAccent() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && typeof IntersectionObserver === 'function'
    && typeof Element !== 'undefined'
    && typeof Element.prototype.animate === 'function'
}

function playMotionAccent(root: MotionAccentRoot, steps: readonly MotionAccentStep[]) {
  const controls: MotionAccentControls[] = []

  for (const step of steps) {
    const matches = Array.from(root.querySelectorAll<HTMLElement>(step.selector))
    matches.forEach((element, index) => {
      controls.push(animateMini(element, { transform: [step.from, 'none'] }, {
        duration: step.duration ?? 0.36,
        delay: (step.delay ?? 0) + index * (step.stagger ?? 0),
        ease,
        onComplete: () => {
          if (element.style.transform === 'none') element.style.transform = ''
        },
      }))
    })
  }

  return () => {
    for (const control of controls) control.cancel()
  }
}

export function setupMotionAccent(
  root: MotionAccentRoot,
  steps: readonly MotionAccentStep[],
): () => void {
  if (!supportsMotionAccent()) return () => {}

  const query = window.matchMedia('(prefers-reduced-motion: no-preference)')
  if (
    !query.matches
    || typeof query.addEventListener !== 'function'
    || typeof query.removeEventListener !== 'function'
  ) return () => {}

  let active = true
  let observing = true
  let stopPlayback: (() => void) | undefined

  function stopObserver() {
    if (!observing) return
    observing = false
    observer.disconnect()
  }

  function stopWatching() {
    query.removeEventListener('change', handleChange)
  }

  function handleChange() {
    if (!active || query.matches) return
    active = false
    stopObserver()
    stopWatching()
    stopPlayback?.()
    stopPlayback = undefined
  }

  const observer = new IntersectionObserver((entries) => {
    if (!active || !observing) return
    if (!entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= visibleRatio)) return
    stopObserver()
    stopPlayback = playMotionAccent(root, steps)
  }, { threshold: visibleRatio })

  observer.observe(root)
  query.addEventListener('change', handleChange)

  return () => {
    if (!active) return
    active = false
    stopObserver()
    stopWatching()
    stopPlayback?.()
    stopPlayback = undefined
  }
}

export function useMotionAccent<T extends HTMLElement>(
  ref: RefObject<T | null>,
  steps: readonly MotionAccentStep[],
): void {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    return setupMotionAccent(root, steps)
  }, [ref, steps])
}
