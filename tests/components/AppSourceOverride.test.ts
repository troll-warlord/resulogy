import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  delete window.__RESULOGY_RESUME_YAML__
  vi.resetModules()
})

describe('App resume source override', () => {
  it('renders injected YAML instead of the bundled sample', async () => {
    window.__RESULOGY_RESUME_YAML__ = `
version: 1
basics:
  name: Alternate Candidate
  label: Platform Engineer
presentation:
  theme: editorial
  page:
    size: letter
sections:
  - type: summary
    text: An alternate resume rendered from an in-memory YAML source.
`

    const { default: App } = await import('../../src/App.vue')
    const wrapper = mount(App)

    expect(wrapper.get('h1').text()).toBe('Alternate Candidate')
    expect(wrapper.text()).toContain('Platform Engineer')
    expect(wrapper.text()).not.toContain('Alex Johnson')
    expect(wrapper.get('.resume-document').attributes('data-page-size')).toBe('letter')
  })
})
