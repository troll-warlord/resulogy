import { vi } from 'vitest'

Object.defineProperty(document, 'fonts', {
  configurable: true,
  value: {
    ready: Promise.resolve(),
    status: 'loaded',
  },
})

Object.defineProperty(window, 'print', {
  configurable: true,
  value: vi.fn(),
})
