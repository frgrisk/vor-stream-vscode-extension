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

### Testing

```bash
npm run test              # Compile and run tests with @vscode/test-electron
```

Tests live in `src/test/suite/` and are discovered automatically by the Mocha loader.

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

### 2. Sync completions in `src/providers/completionProvider.ts`

Update the completion provider to reflect new keywords and context-scoped options:

- Top-level keywords (`name`, `type`, `label`, `descr`, `in`, `out`, `node`, `model`, `subprocess`)
- Input statement options (vary by source: CSV, DB, S3)
- Output statement options (vary by destination: CSV, DB, S3)
- Node statement options (`lang=`, `exec_when=`, `where=`, facts/signals options)
- Model statement options (`type=`, `label=`, `exception_queue=`, `scenario=`, `unit_test=`, `model_name=`)

### 3. Sync syntax highlighting in `syntaxes/strm.tmLanguage.json`

Add new keywords to the appropriate `keyword.control.process` or `keyword.other.process` patterns.

### Current Grammar vs Extension State (as of 2026-03-16)

The extension is fully synced with `vor-stream`'s grammar (commit 832a9b33b, VS-1390).

| Feature / keyword                                                           | Completions | `tmLanguage.json` | Hover docs |
| --------------------------------------------------------------------------- | ----------- | ----------------- | ---------- |
| `labelStmt` / `label=` option                                               | ✅ Present  | ✅ Present        | ✅ Present |
| `modelStmt` (standalone model node)                                         | ✅ Present  | ✅ Present        | ✅ Present |
| `EXCEPTION_QUEUE=` (model exception queue, renamed from `EXCEPTQ`)          | ✅ Present  | ✅ Present        | ✅ Present |
| `SCENARIO=` (true/false)                                                    | ✅ Present  | ✅ Present        | ✅ Present |
| `UNIT_TEST=` (true/false, renamed from `UNITTEST`)                          | ✅ Present  | ✅ Present        | ✅ Present |
| `MODEL_NAME=` (renamed from `MODELNAME`)                                    | ✅ Present  | ✅ Present        | ✅ Present |
| `GET_DYN=` / `SET_DYN=` (snake_case aliases for `GETDYN`/`SETDYN`)          | ✅ Present  | ✅ Present        | ✅ Present |
| `DB` keyword                                                                | ✅ Present  | ✅ Present        | ✅ Present |
| `COMPRESS`, `MINIMIZE`, `CONNECTION`                                        | ✅ Present  | ✅ Present        | ✅ Present |
| `SASCMD`, `SASFILE`, `SASWORK`, `SCENARIODS`                                | ✅ Present  | ✅ Present        | ✅ Present |
| SQL context: `predict=`, `minimize=`, `syntax_version=`                     | ✅ Present  | ✅ Present        | ✅ Present |
| SAS context: `sascmd=`, `sasfile=`, `saswork=`, `scenariods=`, `framework=` | ✅ Present  | ✅ Present        | ✅ Present |

## Architecture Overview

This VSCode extension provides language support for `.strm` files used in VOR Stream processes.

### Core Components

1. **Grammar Parser** (`src/_js_parser/`)

   - ANTLR4-generated JavaScript parser for `.strm` syntax
   - Generated from `vor-stream/cmd/process/process.g4` via ANTLR 4.12.0
   - Uses the `antlr4` npm package (official JS runtime) — **not** `antlr4ts`
   - Consumed by `src/parser.ts` to extract tokens and parse errors

2. **Extension Entry Point** (`src/extension.ts`)

   - Registers all language providers and commands on activation
   - Instantiates shared utilities (e.g., `CsvFileCache`) and wires them into providers

3. **Language Providers**

   - `src/diagnosticProvider.ts` — Real-time syntax error squiggles (500 ms debounce)
   - `src/hoverProvider.ts` — Documentation popups for keywords and node/model signatures
   - `src/documentSymbolProvider.ts` — Outline panel with hierarchical symbol tree
   - `src/providers/completionProvider.ts` — Context-aware auto-completion

4. **Commands** (`src/commands/`)

   - `insertTemplate.ts` — Insert Go/Python process scaffolding
   - `openNodeFile.ts` — F12: navigate to Go/Python implementation file
   - `openInputFile.ts` — Context menu: navigate to input CSV file
   - `createProcess.ts` — Run `vor create process` via VOR Terminal
   - `runProcess.ts` — Run `vor run <name>` via VOR Terminal

5. **Utilities** (`src/utils/`)

   - `csvFileCache.ts` — `FileSystemWatcher`-backed CSV file discovery cache
   - `fileUtils.ts` — `openFirstExisting()`: tries candidate paths in order

6. **Language Configuration**
   - `syntaxes/strm.tmLanguage.json`: TextMate grammar for syntax highlighting
   - `language-configuration.json`: Bracket matching and comment configuration

### Key Features Implementation

- **Auto-completion**: Context-aware suggestions scoped by statement type (`in`, `out`, `node`, `model`, top-level); CSV file names sourced from `CsvFileCache`
- **Hover documentation**: `KEYWORD_DOCS` map in `hoverProvider.ts` covers all top-level keywords plus node/model/subprocess signatures
- **Diagnostics**: ANTLR parse errors mapped to `vscode.Diagnostic`; clears on document close
- **Outline panel**: Hierarchical symbols — subprocess → node/model children; multi-line `model` block range support
- **Navigation**: F12 routes by line type (`in` → CSV, `node`/`model` → Go/Python implementation)
- **File Resolution**:
  - Node files: `src/nodes/<nodename>/<nodename>U.go` for Go, `src/python/<nodename>U.py` for Python (with non-`src/` fallbacks)
  - Input files: Searches `input/` at current level then parent level
- **Template Insertion**: Quick scaffolding for Go and Python process files

### Extension Activation

The extension activates when a `.strm` file is opened (`onLanguage:strm`). All providers and commands are registered during activation.

### Test Infrastructure

Tests use Mocha 11 + `@vscode/test-electron`. Test files live in `src/test/suite/` and cover the parser, completion provider, document symbol provider, and hover provider.

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
- `exception_queue=`: Exception queue for model nodes
- `scenario=`: `true`/`false` model option
- `unit_test=`: `true`/`false` model option
- `model_name=`: Model name string for model nodes

## Release Process

Releases are fully automated via [release-please](https://github.com/googleapis/release-please).
Every merge to `main` using [conventional commits](https://www.conventionalcommits.org/) feeds the pipeline.

### How a release happens

1. **Merge to `main`** using conventional commit messages (`feat:`, `fix:`, `docs:`, etc.)
2. **release-please** automatically opens (or updates) a Release PR that:
   - Bumps `package.json` version (minor for `feat:`, patch for `fix:`)
   - Moves `## [Unreleased]` → `## [x.y.z] - YYYY-MM-DD` in `CHANGELOG.md`
3. **Review and merge the Release PR** — this is the only manual step
4. release-please pushes a `vx.y.z` tag, which triggers `.github/workflows/release.yaml`:
   - Lint → test → update version in `package.json` → bundle → package `.vsix` → GoReleaser publishes to GitHub Releases

### What you must do before merging the Release PR

- [ ] Verify `## [Unreleased]` in `CHANGELOG.md` accurately describes all changes
      (release-please generates this from commit messages — review and edit if needed)
- [ ] The What's New panel will show users exactly this section on their first activation
      after updating, so make sure it reads well

### What you must NOT do

- Do **not** manually edit `package.json` version — release-please owns it
- Do **not** push `v*` tags manually — that triggers the release workflow immediately

### Testing the What's New panel locally before release

```bash
# Build vsix from current branch (update-version skips without a tag — that's fine)
npm run vsce:package

# Launch VS Code with a fresh isolated profile
code --user-data-dir /tmp/vsc-test --extensions-dir /tmp/vsc-ext

# Install the .vsix via Extensions panel → ⋯ → Install from VSIX
# Open any .strm file → What's New panel should appear showing the current version's changelog
```

> **Note:** VS Code preserves `globalState` (including `lastSeenVersion`) across
> extension uninstall/reinstall. Always use `--user-data-dir` for a clean test.

## Known Bugs / Technical Debt

None known.

## Dependencies

- **antlr4** `^4.13.2`: Official ANTLR4 JavaScript runtime
- **TypeScript 5.7+**: Primary development language
- **ESLint 9.13.0**: Code quality and linting
- **VSCode API 1.73.0+**: Extension platform
- **webpack 5**: Bundles the extension for distribution
