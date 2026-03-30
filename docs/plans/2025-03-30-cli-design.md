# bmermaid CLI 设计文档

## 项目概述

**项目名称**: `bmermaid`

**功能定位**: 将 Mermaid 图表渲染为精美 SVG 或 ASCII 的命令行工具

**核心能力**:
- 支持文件输入: `bmermaid input.mmd -o output.svg`
- 支持 pipe 输入: `echo "graph TD\n A-->B" | bmermaid`
- 输出到文件或 stdout
- 支持 15 个内置主题选择
- 输出格式: SVG 和 ASCII

**技术栈**:
- 运行时: Node.js >= 18
- 包管理: npm
- 构建工具: tsdown
- 核心依赖: `beautiful-mermaid`

## CLI 命令设计

### 基本用法

```bash
# 从文件渲染 SVG
bmermaid input.mmd -o output.svg

# 从 pipe 渲染
cat diagram.mmd | bmermaid -f svg

# 指定主题
bmermaid input.mmd -o output.svg -t tokyo-night

# 输出 ASCII
bmermaid input.mmd -o output.txt -f ascii
bmermaid input.mmd --format ascii

# 输出到 stdout
bmermaid input.mmd -f ascii
bmermaid input.mmd -f svg --stdout

# 详细日志模式
bmermaid diagram.mmd -o output.svg -t tokyo-night --verbose
```

### 命令行参数

| 参数 | 短参数 | 说明 | 默认值 |
|------|--------|------|--------|
| `--input` | `-i` | 输入文件路径 | stdin |
| `--output` | `-o` | 输出文件路径 | stdout |
| `--format` | `-f` | 输出格式 (svg/ascii) | `svg` |
| `--theme` | `-t` | 主题名称 | 默认主题 |
| `--verbose` | | 打印详细日志信息 | `false` |
| `--list-themes` | | 列出所有可用主题 | |
| `--help` | `-h` | 显示帮助信息 | |
| `--version` | `-v` | 显示版本号 | |

### Verbose 模式日志示例

```bash
$ bmermaid diagram.mmd -o output.svg -t tokyo-night --verbose
[verbose] Reading input from: diagram.mmd
[verbose] Using theme: tokyo-night
[verbose] Rendering as SVG format
[verbose] Writing output to: output.svg
[verbose] Done! Output size: 2.3KB
```

## 项目结构

```
bmermaid/
├── src/
│   ├── index.ts          # 主入口，导出核心函数
│   ├── cli.ts            # CLI 命令行入口
│   ├── render.ts         # 渲染逻辑封装
│   └── themes.ts         # 主题列表和验证
│
├── dist/                  # 构建输出目录
│   ├── index.js          # ESM 格式
│   ├── index.cjs         # CJS 格式
│   └── cli.js            # CLI 入口
│
├── package.json
├── tsconfig.json
├── tsdown.config.ts       # tsdown 构建配置
├── README.md
└── LICENSE
```

## tsdown 配置

```typescript
// tsdown.config.ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  minify: false,
  sourcemap: true,
  clean: true,
  external: ['beautiful-mermaid'],
})
```

## 核心代码设计

### src/render.ts

```typescript
import { renderMermaidSVG, renderMermaidASCII, THEMES } from 'beautiful-mermaid'

export type OutputFormat = 'svg' | 'ascii'

export interface RenderOptions {
  format: OutputFormat
  theme?: string
}

export function renderMermaid(code: string, options: RenderOptions): string {
  const themeConfig = options.theme ? THEMES[options.theme as keyof typeof THEMES] : undefined

  if (options.format === 'ascii') {
    return renderMermaidASCII(code, themeConfig)
  }
  return renderMermaidSVG(code, themeConfig)
}
```

### src/themes.ts

```typescript
import { THEMES } from 'beautiful-mermaid'

export const themeList = Object.keys(THEMES) as string[]

export function isValidTheme(theme: string): boolean {
  return theme in THEMES
}

export function listThemes(): void {
  console.log('Available themes:')
  themeList.forEach(name => console.log(`  - ${name}`))
}
```

### src/cli.ts

```typescript
#!/usr/bin/env node
import { parseArgs } from 'node:util'
import { readFileSync, writeFileSync } from 'node:fs'
import { renderMermaid } from './render'
import { themeList, isValidTheme, listThemes } from './themes'

const { values } = parseArgs({
  options: {
    input: { type: 'string', short: 'i' },
    output: { type: 'string', short: 'o' },
    format: { type: 'string', short: 'f', default: 'svg' },
    theme: { type: 'string', short: 't' },
    verbose: { type: 'boolean', default: false },
    'list-themes': { type: 'boolean' },
    help: { type: 'boolean', short: 'h' },
    version: { type: 'boolean', short: 'v' },
  },
  allowPositionals: true,
})

// 参数处理和渲染逻辑
```

### src/index.ts

```typescript
export { renderMermaid } from './render'
export type { RenderOptions, OutputFormat } from './render'
export { themeList, isValidTheme, listThemes } from './themes'
```

## 依赖配置

```json
{
  "dependencies": {
    "beautiful-mermaid": "^1.1.0"
  },
  "devDependencies": {
    "tsdown": "^0.21.0",
    "typescript": "^5.0.0",
    "@types/node": "^22.0.0"
  },
  "engines": {
    "node": ">=18"
  }
}
```

## 发布流程

1. 构建项目: `npm run build`
2. 本地测试: `npm link && bmermaid --help`
3. 发布到 npm: `npm publish`
4. 推送到 GitHub 仓库
