import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import resumeYaml from '../../resume.yaml?raw'
import { processResumeYaml } from '../../src/content/processResumeYaml'
import EditorialResume from '../../src/themes/editorial/EditorialResume.vue'

function loadEditorialResume() {
  const result = processResumeYaml(resumeYaml.replace('theme: ledger', 'theme: editorial'))
  if (!result.success) throw new Error('The bundled resume fixture did not validate.')

  return result.data
}

describe('EditorialResume', () => {
  it('renders every supported section in YAML order', () => {
    const wrapper = mount(EditorialResume, {
      props: { resume: loadEditorialResume() },
    })

    const headings = wrapper.findAll('.resume-section__title').map((heading) => heading.text())

    expect(headings).toEqual([
      'Profile',
      'Experience',
      'Selected Projects',
      'Skills',
      'Education',
      'Certifications',
      'Recognition',
      'Volunteering',
      'Publications',
      'Languages',
      'Interests',
      'Speaking',
    ])

    expect(wrapper.get('h1').text()).toBe('Alex Johnson')
    expect(wrapper.findAll('h3')[0]?.text()).toContain('Northstar Labs')
    expect(wrapper.find('.resume-entry__details').text()).toContain('Senior Full-Stack Engineer')
    expect(wrapper.get('[aria-label="Technologies"]').text()).toContain('TypeScript')
    expect(wrapper.find('a[href="https://github.com/alexjohnson/relay"]').exists()).toBe(true)
    expect(wrapper.find('[data-brand-icon="github"]').exists()).toBe(true)
    expect(wrapper.find('[data-brand-icon="linkedin"]').exists()).toBe(true)
    expect(wrapper.find('[data-brand-icon="credly"]').exists()).toBe(true)
    expect(wrapper.get('.resume-list').attributes('data-bullet-marker')).toBe('disc')
    expect(wrapper.text()).toContain('Professional working proficiency')
  })

  it('applies validated paper and presentation settings', () => {
    const wrapper = mount(EditorialResume, {
      props: { resume: loadEditorialResume() },
    })
    const document = wrapper.get('.resume-document')

    expect(document.attributes('data-page-size')).toBe('a4')
    expect(document.attributes('data-page-margin')).toBe('standard')
    expect(document.attributes('style')).toContain('--resume-color-accent: #176b87')
    expect(document.attributes('style')).toContain("--resume-font-family: 'Source Sans 3 Variable'")
  })
})
