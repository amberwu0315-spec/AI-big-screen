export const APP_LOCALES = ['zh-CN', 'en-US'] as const

export type AppLocale = (typeof APP_LOCALES)[number]

export type LocalizedText = Record<AppLocale, string>

export type LocalizableText = string | LocalizedText | null | undefined

export const DEFAULT_APP_LOCALE: AppLocale = 'zh-CN'
export const APP_LOCALE_STORAGE_KEY = 'cyacle-x.language'
export const APP_LOCALE_CHANGE_EVENT = 'cyacle-x:language-change'

export const APP_LOCALE_LABELS: Record<AppLocale, string> = {
  'zh-CN': '中文',
  'en-US': 'English',
}

export interface AppLocaleChangeDetail {
  locale: AppLocale
}

export function isAppLocale(value: unknown): value is AppLocale {
  return typeof value === 'string' && APP_LOCALES.includes(value as AppLocale)
}

export function isLocalizedText(value: unknown): value is LocalizedText {
  return (
    !!value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    APP_LOCALES.every(
      (locale) => typeof (value as Partial<LocalizedText>)[locale] === 'string',
    )
  )
}

export function readStoredAppLocale(): AppLocale {
  if (typeof window === 'undefined') return DEFAULT_APP_LOCALE

  const stored = window.localStorage.getItem(APP_LOCALE_STORAGE_KEY)
  return isAppLocale(stored) ? stored : DEFAULT_APP_LOCALE
}

export function getCurrentAppLocale(): AppLocale {
  if (
    typeof document !== 'undefined' &&
    isAppLocale(document.documentElement.lang)
  ) {
    return document.documentElement.lang
  }

  return readStoredAppLocale()
}

export function applyDocumentLocale(locale: AppLocale) {
  if (typeof document === 'undefined') return

  document.documentElement.lang = locale
}

export function setStoredAppLocale(locale: AppLocale) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(APP_LOCALE_STORAGE_KEY, locale)
}

export function setAppLocale(locale: AppLocale) {
  setStoredAppLocale(locale)
  applyDocumentLocale(locale)

  if (typeof window === 'undefined') return

  window.dispatchEvent(
    new CustomEvent<AppLocaleChangeDetail>(APP_LOCALE_CHANGE_EVENT, {
      detail: { locale },
    }),
  )
}

export function initializeAppLocale(): AppLocale {
  const locale = readStoredAppLocale()
  applyDocumentLocale(locale)
  return locale
}

export function localizeText(
  value: LocalizableText,
  locale: AppLocale = getCurrentAppLocale(),
): string {
  if (value == null) return ''
  if (typeof value === 'string') return value

  return value[locale] ?? value[DEFAULT_APP_LOCALE] ?? ''
}

export function defineLocalizedText(zhCN: string, enUS: string): LocalizedText {
  return {
    'zh-CN': zhCN,
    'en-US': enUS,
  }
}
