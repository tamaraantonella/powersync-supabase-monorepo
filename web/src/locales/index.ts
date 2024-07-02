//import enUS from 'antd/locale/en_US';
//import esES from 'antd/locale/es_ES';

import { getEnUsLang, getEsEsLang } from './helper'

export * from './t'

export type LanguageType = 'en-US' | 'es-ES'

export const ANT_DESIGN_LOCALE = {
  'en-US': 'US', //enUS
  'es-ES': 'ES', //esES
}

export const i18nResources = {
  'en-US': {
    translation: getEnUsLang(),
  },
  'es-ES': {
    translation: getEsEsLang(),
  },
}

export const i18nInitOptions = {
  lng: 'es-ES',
  resources: i18nResources,
}

export default i18nInitOptions
