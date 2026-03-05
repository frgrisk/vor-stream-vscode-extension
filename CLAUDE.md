# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Compile

```bash
npm run compile       # Build with webpack (development mode)
npm run package       # Build with webpack (production mode)
npm run watch         # Watch mode for development with webpack
npm run compile-ts    # Legacy TypeScript compilation (if needed)
```

### Linting and Formatting

```bash
npm run lint          # Run ESLint
npm run format        # Run Prettier (auto-fix)
npm run format:check  # Run Prettier (check only, used in CI)
```

### Pre-commit Hooks

This project uses [pre-commit](https://pre-commit.com/) to enforce formatting and commit messages.
Install once after cloning:

```bash
pip install pre-commit
pre-commit install --hook-type pre-commit --hook-type commit-msg
```

Hooks run automatically on `git commit`. To run manually against all files:

```bash
pre-commit run --all-files
```

The hooks configured in `.pre-commit-config.yaml`:

- **end-of-file-fixer** — ensures files end with a newline
- **trailing-whitespace** — strips trailing whitespace
- **prettier** — formats `.ts`, `.js`, `.json`, `.md`, `.yaml` files
- **conventional-pre-commit** (`commit-msg` stage) — enforces conventional commit format locally,
  matching the CI check (allowed types: feat, fix, docs, style, refactor, test, build, ci, chore, revert, perf)

### Publishing

```bash
npm run vscode:prepublish  # Prepare for publishing (webpack bundle + update version)
```

## Repository Relationships

| Repo                          | Location                    | Role                                                               |
| ----------------------------- | --------------------------- | ------------------------------------------------------------------ |
| `vor-stream`                  | `/home/kng/repo/vor-stream` | Source of truth for the `.strm` grammar (`cmd/process/process.g4`) |
| `vor-stream-vscode-extension` | this repo                   | VS Code extension that consumes the ANTLR-generated JS parser      |

The ANTLR-generated files in `src/_js_parser/` are produced from `vor-stream/cmd/process/process.g4`.

## Grammar Sync Workflow

When `vor-stream`'s grammar (`cmd/process/process.g4`) changes, update the extension in three places:

### 1. Regenerate the ANTLR JS parser

Run ANTLR 4.12+ against the grammar with the JavaScript target:

```bash
java -jar antlr-4.12.0-complete.jar \
  -Dlanguage=JavaScript \
  -visitor \
  -o src/_js_parser/ \
  /home/kng/repo/vor-stream/cmd/process/process.g4
```

### 2. Sync completions in `src/extension.ts`

Update `predefinedCompletions` and `snippetTemplates` to reflect new keywords and options.

### 3. Sync syntax highlighting in `syntaxes/strm.tmLanguage.json`

Add new keywords to the appropriate `keyword.control.process` or `keyword.other.process` patterns.

### Current Grammar vs Extension State (as of 2026-03-05)

The extension is behind `vor-stream`'s grammar. Missing:

| Grammar addition                    | `extension.ts` | `tmLanguage.json`               |
| ----------------------------------- | -------------- | ------------------------------- |
| `labelStmt` / `label=` option       | Missing        | Partial (LABEL in control only) |
| `modelStmt` (standalone model node) | Missing        | Missing                         |
| `EXCEPTQ=` (model exception queue)  | Missing        | Missing                         |
| `SCENARIO=` (true/false)            | Missing        | Missing                         |
| `UNITTEST=` (true/false)            | Missing        | Missing                         |
| `MODELNAME=`                        | Missing        | Missing                         |
| `DB` keyword                        | In completions | Missing from highlighting       |

## Architecture Overview

This VSCode extension provides language support for `.strm` files used in VOR Stream processes.

### Core Components

1. **Grammar Parser** (`src/_js_parser/`)

   - ANTLR4-generated JavaScript parser for `.strm` syntax
   - Generated from `vor-stream/cmd/process/process.g4` via ANTLR 4.12.0
   - Uses the `antlr4` npm package (official JS runtime) — **not** `antlr4ts`
   - Consumed by `src/parser.ts` to extract tokens for auto-completion

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
- `type`: Process type (`Default`, `Report`, `Model`)
- `label`: Human-readable label string (quoted), e.g. `label "My Process"`
- `lang`: Language — used as `lang=go` or `lang=python` (note: `=` not space)
- `in` / `out`: Input/output declarations with `->` syntax
- `node`: Processing node definition — `node name(inputs)(outputs) [opts]`
- `model`: Standalone model node — `model name(inputs)(outputs) [opts]`
- `db`: Database — `db=PG` or `db=MSSQL`
- `mode`: Processing mode — `mode=Append` or `mode=Replace`
- `exceptq=`: Exception queue for model nodes
- `scenario=`: `true`/`false` model option
- `unittest=`: `true`/`false` model option
- `modelname=`: Model name string for model nodes

## Known Bugs / Technical Debt

- **F12 keybinding hijacks all files**: `extension.openNodeFile` is bound to `f12` with
  `when: "editorTextFocus"`, overriding VS Code's native Go to Definition in every language.
  Should be `when: "editorLangId == strm"`. Fixed in `fix/p1-bugs`.
- **`runProcessCommand` is cursor-position fragile**: Requires cursor on the `name` line.
  Should parse the whole document instead.
- **`antlr4ts` is an unused dependency**: `package.json` lists `antlr4ts` (`^0.5.0-alpha.4`,
  unmaintained) but all code uses `antlr4`. Safe to remove.
- **`completionItemProvider` in `package.json` contributes**: Not a standard VS Code manifest
  field — does nothing. Can be removed.
- **`dist/` build artifacts committed**: `vor-stream-0.0.1.vsix`, `dist/metadata.json`,
  `dist/artifacts.json`, `dist/config.yaml` should be in `.gitignore`.

## Dependencies

- **antlr4** `^4.13.2`: Official ANTLR4 JavaScript runtime
- **TypeScript 5.7+**: Primary development language
- **ESLint 9.13.0**: Code quality and linting
- **VSCode API 1.73.0+**: Extension platform
- **webpack 5**: Bundles the extension for distribution
