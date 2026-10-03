import resumeYaml from '../../resume.yaml?raw'

import { processResumeYaml } from './processResumeYaml'

export function loadResume(source = resumeYaml) {
  return processResumeYaml(source)
}
