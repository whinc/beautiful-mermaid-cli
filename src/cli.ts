#!/usr/bin/env node
import { parseArgs } from 'node:util'
import { readFileSync, writeFileSync, statSync } from 'node:fs'
import { stdin } from 'node:process'
import { renderMermaid } from './render.js'
import { themeList, isValidTheme, listThemes } from './themes.js'

const VERSION = '0.1.0'

const HELP_TEXT = `
bmermaid - Render Mermaid diagrams as beautiful SVG or ASCII

Usage:
  bmermaid [input] [options]
  cat diagram.mmd | bmermaid [options]

Options:
  -i, --input <file>     Input file path (default: stdin)
  -o, --output <file>    Output file path (default: stdout)
  -f, --format <format>  Output format: svg or ascii (default: svg)
  -t, --theme <theme>    Theme name (use --list-themes to see options)
  --verbose              Print detailed log information
  --list-themes          List all available themes
  -h, --help             Show this help message
  -v, --version          Show version number

Examples:
  bmermaid diagram.mmd -o output.svg
  bmermaid diagram.mmd -o output.txt -f ascii
  bmermaid diagram.mmd -o output.svg -t tokyo-night --verbose
  cat diagram.mmd | bmermaid -f ascii > output.txt
`

function log(message: string, verbose: boolean): void {
  if (verbose) {
    console.error(`[verbose] ${message}`)
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

async function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = ''
    stdin.setEncoding('utf8')
    stdin.on('data', chunk => {
      data += chunk
    })
    stdin.on('end', () => {
      resolve(data)
    })
    stdin.on('error', reject)
  })
}

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
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

  const options = {
    input: values.input ?? positionals[0],
    output: values.output,
    format: values.format as 'svg' | 'ascii',
    theme: values.theme,
    verbose: values.verbose,
    listThemes: values['list-themes'],
    help: values.help,
    version: values.version,
  }

  if (options.help) {
    console.log(HELP_TEXT)
    process.exit(0)
  }

  if (options.version) {
    console.log(`bmermaid v${VERSION}`)
    process.exit(0)
  }

  if (options.listThemes) {
    listThemes()
    process.exit(0)
  }

  // Validate format
  if (options.format !== 'svg' && options.format !== 'ascii') {
    console.error(`Error: Invalid format "${options.format}". Use "svg" or "ascii".`)
    process.exit(1)
  }

  // Validate theme
  if (options.theme && !isValidTheme(options.theme)) {
    console.error(`Error: Unknown theme "${options.theme}".`)
    console.error('Use --list-themes to see available themes.')
    process.exit(1)
  }

  // Read input
  let input: string
  if (options.input) {
    log(`Reading input from: ${options.input}`, options.verbose)
    try {
      input = readFileSync(options.input, 'utf8')
    } catch (error) {
      console.error(`Error: Cannot read file "${options.input}"`)
      process.exit(1)
    }
  } else {
    log('Reading input from stdin', options.verbose)
    input = await readStdin()
  }

  if (!input.trim()) {
    console.error('Error: No input provided')
    process.exit(1)
  }

  // Render
  log(`Using theme: ${options.theme ?? 'default'}`, options.verbose)
  log(`Rendering as ${options.format.toUpperCase()} format`, options.verbose)

  let result: string
  try {
    result = renderMermaid(input, {
      format: options.format,
      theme: options.theme,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`Error: Failed to render diagram - ${message}`)
    process.exit(1)
  }

  // Write output
  if (options.output) {
    log(`Writing output to: ${options.output}`, options.verbose)
    try {
      writeFileSync(options.output, result, 'utf8')
      const stats = statSync(options.output)
      log(`Done! Output size: ${formatBytes(stats.size)}`, options.verbose)
    } catch (error) {
      console.error(`Error: Cannot write to file "${options.output}"`)
      process.exit(1)
    }
  } else {
    process.stdout.write(result)
  }
}

main().catch(error => {
  console.error('Error:', error.message)
  process.exit(1)
})
