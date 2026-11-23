import type { MouseEvent } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { closeMenuOnOrdinaryClick } from './site-shell'

function activation(overrides: Partial<MouseEvent<HTMLAnchorElement>> = {}) {
  return {
    button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, ...overrides,
  } as MouseEvent<HTMLAnchorElement>
}

describe('menu link activation', () => {
  it.each([
    ['ordinary', {}, true],
    ['command', { metaKey: true }, false],
    ['control', { ctrlKey: true }, false],
    ['shift', { shiftKey: true }, false],
    ['alt', { altKey: true }, false],
    ['secondary button', { button: 1 }, false],
  ] as const)('closes only for %s activation', (_, overrides, closes) => {
    const close = vi.fn()
    closeMenuOnOrdinaryClick(activation(overrides), close)
    expect(close).toHaveBeenCalledTimes(closes ? 1 : 0)
  })
})
