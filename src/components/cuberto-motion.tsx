import { animate } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from 'react'
import type { ElementType, ReactNode, Ref } from 'react'
import { elasticPath, clamp } from '../lib/cuberto'

export const REVEAL_EVENT = 'cb:reveal'

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isCovering(): boolean {
  return typeof document !== 'undefined' && document.documentElement.dataset.cover === '1'
}

/** Start after the route cover begins clearing, or after hydration on a direct load. */
function startOnEnter(play: () => void): () => void {
  let cancelled = false
  let frame = 0
  let timer = 0
  const start = () => {
    if (cancelled) return
    window.removeEventListener(REVEAL_EVENT, start)
    frame = requestAnimationFrame(play)
  }
  if (isCovering()) {
    window.addEventListener(REVEAL_EVENT, start, { once: true })
    // A missed event must never leave the page hidden.
    timer = window.setTimeout(start, 4000)
  } else {
    frame = requestAnimationFrame(start)
  }
  return () => {
    cancelled = true
    cancelAnimationFrame(frame)
    clearTimeout(timer)
    window.removeEventListener(REVEAL_EVENT, start)
  }
}

/** Wrap each word in an overflow mask while leaving the original whitespace intact. */
function splitWords(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    if (node.nodeValue) nodes.push(node)
  }
  for (const node of nodes) {
    const fragment = document.createDocumentFragment()
    for (const part of (node.nodeValue ?? '').split(/(\s+)/)) {
      if (!part) continue
      if (/^\s+$/.test(part)) {
        fragment.append(document.createTextNode(part))
        continue
      }
      const mask = document.createElement('span')
      mask.className = 'cb-w'
      const word = document.createElement('span')
      word.className = 'cb-wi'
      word.textContent = part
      mask.append(word)
      fragment.append(mask)
    }
    node.replaceWith(fragment)
  }
}

type MaskedTextProps = {
  as?: ElementType
  id?: string
  className?: string
  children: ReactNode
  /** Play when the route cover starts clearing. Otherwise reveal on scroll. */
  enter?: boolean
  delay?: number
  duration?: number
  staggerAmount?: number
}

/**
 * Cuberto's masked word reveal: words rise from behind an overflow mask,
 * 1.7s expo.out with a 0.6s total stagger. Splitting happens on the client so
 * server HTML keeps plain, readable and searchable text.
 */
export function MaskedText({
  as = 'p', id, className, children, enter = false, delay = 0, duration = 1.7, staggerAmount = 0.6,
}: MaskedTextProps) {
  const ref = useRef<HTMLElement | null>(null)

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const original = el.innerHTML
    splitWords(el)
    const words = Array.from(el.querySelectorAll<HTMLElement>('.cb-wi'))
    if (!words.length) {
      el.innerHTML = original
      return
    }
    words.forEach((word) => {
      word.style.transform = 'translateY(120%)'
      word.style.willChange = 'transform'
    })

    const controls: Array<{ stop: () => void }> = []
    let cancelled = false

    const play = () => {
      if (cancelled) return
      const step = words.length > 1 ? staggerAmount / (words.length - 1) : 0
      words.forEach((word, index) => {
        controls.push(animate(word, { y: ['120%', '0%'] }, {
          duration,
          delay: delay + index * step,
          ease: [0.16, 1, 0.3, 1],
        }))
      })
    }

    let stopStart = () => {}
    let observer: IntersectionObserver | undefined
    if (enter) {
      stopStart = startOnEnter(play)
    } else {
      const created = new IntersectionObserver(([entry]) => {
        if (!entry?.isIntersecting) return
        created.disconnect()
        play()
      }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' })
      created.observe(el)
      observer = created
    }

    const onPreference = (event: MediaQueryListEvent) => {
      if (!event.matches) return
      cancelled = true
      stopStart()
      observer?.disconnect()
      controls.forEach((control) => control.stop())
      el.innerHTML = original
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.addEventListener('change', onPreference)

    return () => {
      cancelled = true
      stopStart()
      observer?.disconnect()
      reduced.removeEventListener('change', onPreference)
      controls.forEach((control) => control.stop())
      el.innerHTML = original
    }
  }, [delay, duration, enter, staggerAmount])

  const Tag = as as ElementType
  return <Tag ref={ref as Ref<HTMLElement>} className={className} id={id}>{children}</Tag>
}

/** Generic upward entrance: transform 2s / opacity 1s, one-shot on entry. */
export function Reveal({
  children, className, delay = 0, distance = 70, as = 'div', id, enter = false,
}: {
  children: ReactNode
  className?: string
  delay?: number
  distance?: number
  as?: ElementType
  id?: string
  /** Play with the route reveal instead of on scroll (hero copy and actions). */
  enter?: boolean
}) {
  const ref = useRef<HTMLElement | null>(null)

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const controls: Array<{ stop: () => void }> = []
    let played = false

    const play = () => {
      if (played) return
      played = true
      el.style.willChange = 'transform, opacity'
      controls.push(animate(el, { y: [distance, 0] }, {
        duration: 2, delay, ease: [0.16, 1, 0.3, 1],
      }))
      controls.push(animate(el, { opacity: [0, 1] }, {
        duration: 1, delay, ease: 'easeOut',
      }))
    }

    el.style.transform = `translateY(${distance}px)`
    el.style.opacity = '0'
    let observer: IntersectionObserver | undefined
    let stopStart = () => {}
    if (enter) {
      stopStart = startOnEnter(play)
    } else {
      const created = new IntersectionObserver(([entry]) => {
        if (!entry?.isIntersecting) return
        created.disconnect()
        play()
      }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' })
      created.observe(el)
      observer = created
    }

    const onPreference = (event: MediaQueryListEvent) => {
      if (!event.matches) return
      controls.forEach((control) => control.stop())
      el.style.transform = ''
      el.style.opacity = ''
      observer?.disconnect()
      stopStart()
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.addEventListener('change', onPreference)

    return () => {
      observer?.disconnect()
      stopStart()
      reduced.removeEventListener('change', onPreference)
      controls.forEach((control) => control.stop())
    }
  }, [delay, distance, enter])

  const Tag = as as ElementType
  return <Tag ref={ref as Ref<HTMLElement>} className={className} id={id}>{children}</Tag>
}

export function useMediaQuery(query: string): boolean {
  const subscribe = (onChange: () => void) => {
    const list = window.matchMedia(query)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Straight rule by default; a pointer-driven quadratic once enhanced. */
export function ElasticRule({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const path = pathRef.current
    if (!root || !path) return
    let width = 0
    let height = 0
    const control = { x: 0, y: 0 }
    let release = 0

    const draw = () => {
      if (!width || !height) return
      path.setAttribute('d', elasticPath(width, height, control.x, control.y))
    }

    const measure = () => {
      const rect = root.getBoundingClientRect()
      width = rect.width
      height = rect.height
      checkTarget()
      root.dataset.enhanced = 'true'
      draw()
    }
    const checkTarget = () => {
      control.x = width / 2
      control.y = height / 2
    }

    const canMove = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches
      && !prefersReducedMotion()

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !canMove()) return
      cancelAnimationFrame(release)
      const rect = root.getBoundingClientRect()
      const localX = event.clientX - rect.left
      const localY = event.clientY - rect.top
      control.x = clamp(localX, 0, width)
      control.y = height / 2 + clamp((localY - height / 2) * 0.7, -height * 0.8, height * 0.8)
      draw()
    }

    const onLeave = () => {
      if (!canMove()) {
        checkTarget()
        draw()
        return
      }
      const startX = control.x - width / 2
      const startY = control.y - height / 2
      const started = performance.now()
      cancelAnimationFrame(release)
      const tick = (now: number) => {
        const t = (now - started) / 1000
        if (t >= 1.8) {
          checkTarget()
          draw()
          return
        }
        const decay = Math.exp(-3 * t) * Math.cos(9 * t)
        control.x = width / 2 + startX * decay
        control.y = height / 2 + startY * decay
        draw()
        release = requestAnimationFrame(tick)
      }
      release = requestAnimationFrame(tick)
    }

    const observer = new ResizeObserver(measure)
    observer.observe(root)
    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    measure()

    return () => {
      cancelAnimationFrame(release)
      observer.disconnect()
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      delete root.dataset.enhanced
    }
  }, [])

  return (
    <div className={`elastic-rule${className ? ` ${className}` : ''}`} ref={rootRef} aria-hidden="true">
      <span className="elastic-base" />
      <svg className="elastic-svg" preserveAspectRatio="none">
        <path ref={pathRef} d="M0 0" />
      </svg>
    </div>
  )
}
