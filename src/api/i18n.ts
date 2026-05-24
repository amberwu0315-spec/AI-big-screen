import type { AppLocale, LocalizedText } from '@/lib/locale'
import { getCurrentAppLocale, isAppLocale, localizeText } from '@/lib/locale'

export interface ApiI18nOptions {
  locale?: AppLocale
  lang?: AppLocale | string
}

export function resolveApiLocale(options?: ApiI18nOptions): AppLocale {
  const requestedLocale = options?.locale ?? options?.lang
  return isAppLocale(requestedLocale) ? requestedLocale : getCurrentAppLocale()
}

export function localizeApiText(
  value: string | LocalizedText | null | undefined,
  options?: ApiI18nOptions,
): string {
  return localizeText(value, resolveApiLocale(options))
}
