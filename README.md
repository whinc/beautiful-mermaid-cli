# bmermaid

A CLI tool to render Mermaid diagrams as beautiful SVG or ASCII.

## Features

- 📁 **File or stdin input** - Read from file or pipe
- 📤 **File or stdout output** - Write to file or pipe
- 🎨 **15 built-in themes** - Tokyo Night, Dracula, Nord, Catppuccin, and more
- 📊 **SVG and ASCII output** - Rich vector graphics or terminal-friendly text
- 🔍 **Verbose mode** - Detailed logging for debugging

## Installation

```bash
npm install -g bmermaid
```

Or use with npx:

```bash
npx bmermaid diagram.mmd -o output.svg
```

## Usage

### Basic

```bash
# Render SVG from file
bmermaid diagram.mmd -o output.svg

# Render ASCII from file
bmermaid diagram.mmd -o output.txt -f ascii

# Use a specific theme
bmermaid diagram.mmd -o output.svg -t tokyo-night

# Verbose mode
bmermaid diagram.mmd -o output.svg --verbose
```

### Pipe input

```bash
# Pipe mermaid code to bmermaid
cat diagram.mmd | bmermaid -f ascii

# Use in scripts
echo "graph TD\n  A --> B" | bmermaid -f svg > output.svg
```

### List themes

```bash
bmermaid --list-themes
```

Available themes:
- zinc-light, zinc-dark
- tokyo-night, tokyo-night-storm, tokyo-night-light
- catppuccin-mocha, catppuccin-latte
- nord, nord-light
- dracula
- github-light, github-dark
- solarized-light, solarized-dark
- one-dark

## CLI Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--input` | `-i` | Input file path | stdin |
| `--output` | `-o` | Output file path | stdout |
| `--format` | `-f` | Output format (svg/ascii) | svg |
| `--theme` | `-t` | Theme name | default |
| `--verbose` | | Print detailed log | false |
| `--list-themes` | | List all available themes | |
| `--help` | `-h` | Show help message | |
| `--version` | `-v` | Show version | |

## Programmatic API

```typescript
import { renderMermaid, themeList } from 'bmermaid'

// Render as SVG
const svg = renderMermaid('graph TD\n  A --> B', { format: 'svg' })

// Render as ASCII
const ascii = renderMermaid('graph TD\n  A --> B', { format: 'ascii' })

// Use a theme
const themed = renderMermaid('graph TD\n  A --> B', {
  format: 'svg',
  theme: 'tokyo-night'
})

// List available themes
console.log(themeList)
```

## License

MIT
