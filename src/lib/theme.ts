export const colorSchemeKey = 'linksense-color-scheme'
export const systemColorScheme = '(prefers-color-scheme: dark)'

export function nextColorOverride(preference: string, systemDark: boolean): 'light' | 'dark' | null {
  const current = preference === 'light' || preference === 'dark'
    ? preference
    : systemDark ? 'dark' : 'light'
  const next = current === 'dark' ? 'light' : 'dark'
  return (next === 'dark') === systemDark ? null : next
}
