import { renderMermaidSVG, renderMermaidASCII, THEMES } from 'beautiful-mermaid'

export type OutputFormat = 'svg' | 'ascii'

export interface RenderOptions {
  format: OutputFormat
  theme?: string
}

export function renderMermaid(code: string, options: RenderOptions): string {
  const themeConfig = options.theme
    ? THEMES[options.theme as keyof typeof THEMES]
    : undefined

  if (options.format === 'ascii') {
    return renderMermaidASCII(code, themeConfig)
  }
  return renderMermaidSVG(code, themeConfig)
}
