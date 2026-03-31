# Demo Examples

This directory contains example Mermaid diagrams and their rendered outputs.

## Flowchart Example

**Source**: `flowchart.mmd`

A flowchart showing the CLI processing flow.

**Rendered outputs**:
- `flowchart.svg` - SVG output with Tokyo Night theme
- `flowchart.txt` - ASCII output

**Commands**:
```bash
# Generate SVG
bmermaid demo/flowchart.mmd -o demo/flowchart.svg -t tokyo-night

# Generate ASCII
bmermaid demo/flowchart.mmd -o demo/flowchart.txt -f ascii
```

## Sequence Diagram Example

**Source**: `sequence.mmd`

A sequence diagram showing the CLI workflow.

**Rendered outputs**:
- `sequence.svg` - SVG output with Dracula theme
- `sequence.txt` - ASCII output

**Commands**:
```bash
# Generate SVG
bmermaid demo/sequence.mmd -o demo/sequence.svg -t dracula

# Generate ASCII
bmermaid demo/sequence.mmd -o demo/sequence.txt -f ascii
```

## Try it yourself

```bash
# Pipe input
cat demo/flowchart.mmd | bmermaid -f ascii

# Verbose mode
bmermaid demo/flowchart.mmd -o output.svg -t nord --verbose

# List all themes
bmermaid --list-themes
```
