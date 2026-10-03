import type { Component } from 'vue'

import type { NormalizedSection } from '@/domain/resume'

import AwardsSection from './AwardsSection.vue'
import CertificationsSection from './CertificationsSection.vue'
import CustomSection from './CustomSection.vue'
import EducationSection from './EducationSection.vue'
import ExperienceSection from './ExperienceSection.vue'
import InterestsSection from './InterestsSection.vue'
import LanguagesSection from './LanguagesSection.vue'
import ProjectsSection from './ProjectsSection.vue'
import PublicationsSection from './PublicationsSection.vue'
import SkillsSection from './SkillsSection.vue'
import SummarySection from './SummarySection.vue'
import VolunteeringSection from './VolunteeringSection.vue'

export const sectionComponents = {
  summary: SummarySection,
  experience: ExperienceSection,
  projects: ProjectsSection,
  education: EducationSection,
  skills: SkillsSection,
  certifications: CertificationsSection,
  awards: AwardsSection,
  volunteering: VolunteeringSection,
  publications: PublicationsSection,
  languages: LanguagesSection,
  interests: InterestsSection,
  custom: CustomSection,
} satisfies Record<NormalizedSection['type'], Component>
