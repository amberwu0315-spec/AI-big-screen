import * as React from 'react'
import type {
  AppLocale,
  AppLocaleChangeDetail,
  LocalizableText,
} from '@/lib/locale'
import {
  APP_LOCALE_CHANGE_EVENT,
  initializeAppLocale,
  isAppLocale,
  localizeText,
  setAppLocale,
} from '@/lib/locale'

interface AppLocaleContextValue {
  locale: AppLocale
  setLocale: (locale: AppLocale) => void
  t: (value: LocalizableText) => string
}

const AppLocaleContext = React.createContext<AppLocaleContextValue | null>(null)

export function AppLocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<AppLocale>(() =>
    initializeAppLocale(),
  )

  React.useEffect(() => {
    const handleLocaleChange = (event: Event) => {
      const detail = (event as CustomEvent<AppLocaleChangeDetail>).detail
      if (!isAppLocale(detail?.locale)) return

      setLocaleState(detail.locale)
    }

    window.addEventListener(APP_LOCALE_CHANGE_EVENT, handleLocaleChange)
    return () => {
      window.removeEventListener(APP_LOCALE_CHANGE_EVENT, handleLocaleChange)
    }
  }, [])

  const handleSetLocale = React.useCallback((nextLocale: AppLocale) => {
    setAppLocale(nextLocale)
    setLocaleState(nextLocale)
  }, [])

  const t = React.useCallback(
    (value: LocalizableText) => localizeText(value, locale),
    [locale],
  )

  const contextValue = React.useMemo<AppLocaleContextValue>(
    () => ({
      locale,
      setLocale: handleSetLocale,
      t,
    }),
    [handleSetLocale, locale, t],
  )

  return (
    <AppLocaleContext.Provider value={contextValue}>
      {children}
    </AppLocaleContext.Provider>
  )
}

export function useAppLocale() {
  const context = React.useContext(AppLocaleContext)
  if (!context) {
    throw new Error('useAppLocale must be used within AppLocaleProvider')
  }

  return context
}
