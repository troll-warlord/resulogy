import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ResumeHeader from '../../src/components/resume/ResumeHeader.vue'

describe('ResumeHeader', () => {
  it('renders known brand marks and a globe fallback for unknown networks', () => {
    const wrapper = mount(ResumeHeader, {
      props: {
        basics: {
          name: 'Alex Johnson',
          social: [
            { network: 'GitHub', url: 'https://github.com/alexjohnson' },
            { network: 'LinkedIn', url: 'https://linkedin.com/in/alexjohnson' },
            { network: 'Credly', url: 'https://www.credly.com/users/alexjohnson' },
            { network: 'Personal Community', url: 'https://community.example.com/alex' },
          ],
        },
      },
    })

    expect(wrapper.find('[data-brand-icon="github"]').exists()).toBe(true)
    expect(wrapper.find('[data-brand-icon="linkedin"]').exists()).toBe(true)
    expect(wrapper.find('[data-brand-icon="credly"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-generic-icon="globe"]')).toHaveLength(1)
  })

  it('matches common network aliases without restricting custom names', () => {
    const wrapper = mount(ResumeHeader, {
      props: {
        basics: {
          name: 'Alex Johnson',
          social: [
            { network: 'Stack Overflow', url: 'https://stackoverflow.com/users/123/alex' },
            { network: 'Dev.to', url: 'https://dev.to/alexjohnson' },
            { network: 'Twitter', url: 'https://x.com/alexjohnson' },
          ],
        },
      },
    })

    expect(wrapper.find('[data-brand-icon="stackoverflow"]').exists()).toBe(true)
    expect(wrapper.find('[data-brand-icon="devdotto"]').exists()).toBe(true)
    expect(wrapper.find('[data-brand-icon="x"]').exists()).toBe(true)
  })
})
