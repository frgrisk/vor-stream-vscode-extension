# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Compile

```bash
npm run compile       # Build with webpack (development mode)
npm run package       # Build with webpack (production mode)
npm run watch        # Watch mode for development with webpack
npm run compile-ts    # Legacy TypeScript compilation (if needed)
```

### Linting

```bash
npm run lint         # Run ESLint
```

### Publishing

```bash
npm run vscode:prepublish  # Prepare for publishing (webpack bundle + update version)
```

## Architecture Overview

This VSCode extension provides language support for `.strm` files used in VOR Stream processes. The extension is built around three core components:

### Core Components

1. **Grammar Parser** (`src/_js_parser/`)
   - ANTLR4-generated parser for `.strm` syntax
   - Provides tokenization and parsing capabilities
   - Used by `parser.ts` to extract tokens for auto-completion

2. **Extension Entry Point** (`src/extension.ts`)
   - Registers completion providers for intelligent auto-completion
   - Implements commands for template insertion (Go/Python)
   - Handles navigation commands (Go to Node File, Go to Input File)
   - Integrates with VOR CLI commands (create/run process)

3. **Language Configuration**
   - `syntaxes/strm.tmLanguage.json`: TextMate grammar for syntax highlighting
   - `language-configuration.json`: Bracket matching and comment configuration

### Key Features Implementation

- **Auto-completion**: Context-aware suggestions based on ANTLR4 parsing, predefined templates, and file system analysis
- **Navigation**: F12 to jump to node implementation files (Go/Python), with intelligent path resolution
- **File Resolution**:
  - Node files: `src/nodes/<nodename>/<nodename>U.go` for Go, `src/python/<nodename>U.py` for Python
  - Input files: Searches in `input/` directory at current level and parent level
- **Template Insertion**: Quick scaffolding for Go and Python process files

### Extension Activation

The extension activates when a `.strm` file is opened (`onLanguage:strm`). All providers and commands are registered during activation.

## .strm File Structure

VOR Stream process files use keywords like:

- `name`: Process name
- `type`: Process type (Default, Report, Model)
- `lang`: Language (go, python)
- `in`/`out`: Input/output declarations
- `node`: Processing node definitions
- `db`: Database connection (PG, MSSQL)
- `mode`: Processing mode (Append, Replace)

## Dependencies

- **ANTLR4**: Parser generation and runtime
- **TypeScript 5.7+**: Primary development language
- **ESLint 9.13.0**: Code quality and linting
- **VSCode API 1.73.0+**: Extension platform
