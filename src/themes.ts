import { THEMES } from 'beautiful-mermaid'

export const themeList = Object.keys(THEMES) as string[]

export function isValidTheme(theme: string): boolean {
  return theme in THEMES
}

export function listThemes(): void {
  console.log('Available themes:')
  themeList.forEach(name => console.log(`  - ${name}`))
}
