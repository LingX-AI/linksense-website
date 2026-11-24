export const colorSchemeKey = 'linksense-color-scheme'

export type ThemePreference = 'light' | 'system' | 'dark'

export function themePreference(value: string | null | undefined): ThemePreference {
  return value === 'light' || value === 'dark' ? value : 'system'
}

export function colorSchemeContent(preference: ThemePreference): 'light' | 'dark' | 'light dark' {
  return preference === 'system' ? 'light dark' : preference
}
