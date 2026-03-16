# VOR Stream

VOR Stream is a Visual Studio Code extension designed for syntax highlighting
and auto-completion of `.strm` files used in [VOR Stream](https://github.com/frgrisk/vor-stream) processes. The
extension provides suggestions based on your grammar and predefined templates,
as well as custom completions for commonly used keywords.

## Features

- **Syntax Highlighting**

  - Automatic syntax highlighting for `.strm` files
  - Support for process-specific keywords and constructs

- **Intelligent Auto-Completion**

  - Context-aware suggestions scoped by statement type (`in`, `out`, `node`, `model`, top-level)
  - CSV file names from `input/` directories (auto-refreshed via file watcher)
  - Source/destination-specific options (e.g. S3 `mode=`, DB connection snippets)

- **Hover Documentation**

  - Keyword descriptions and usage examples on hover
  - Node and model signatures showing inputs and outputs

- **Diagnostics**

  - Real-time syntax error squiggles from the ANTLR parser
  - Errors clear automatically when the document is closed

- **Outline Panel**

  - Document structure in the VS Code Outline panel
  - Hierarchical tree: subprocess → node/model children
  - Symbols for `name`, `subprocess`, `node`, `model`, `in`, `out`, `sql`

- **Template Support**

  - Quick insertion of process templates for Go and Python
  - Command palette integration

- **Navigation**

  - `F12` (Go to Definition) routes by line type:
    - `in` lines → CSV file in `input/` directory (S3/DB sources skipped)
    - `node` / `model` lines → Go (`src/nodes/<name>/<name>U.go`) or Python (`src/python/<name>U.py`) implementation
    - `out` lines — not supported (output paths are runtime-determined)
  - Go to input file (context menu)
  - Create and run process commands

## Known Limitations

- F12 on `out` lines is intentionally unsupported
- `runProcessCommand` requires the cursor to be on the `name` line

## Releases

Releases follow [Calendar Versioning](https://calver.org/) in the format `YY.MINOR.MICRO`:

- `YY` — two-digit year (e.g. `26` for 2026)
- `MINOR` — incremental release number within the year, starting at 1
- `MICRO` — patch release number for bug fixes, starting at 0

Each release produces a `.vsix` package attached to the [GitHub Release](https://github.com/frgrisk/vor-stream-vscode-extension/releases). The extension is not currently published to the VS Code Marketplace; install manually from the `.vsix` file.

## Installation

### From GitHub Releases

1. Download the latest `vor-stream-YY.MINOR.MICRO.vsix` from [Releases](https://github.com/frgrisk/vor-stream-vscode-extension/releases)
2. In VS Code, open the Extensions panel (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Click `⋯` → **Install from VSIX…** and select the downloaded file

### From Source

```bash
git clone git@github.com:frgrisk/vor-stream-vscode-extension.git
cd vor-stream-vscode-extension
npm install
npm run compile
# Press F5 in VS Code to launch a development host window
```

## Requirements

- Visual Studio Code 1.73.0 or higher
- Node.js 22.x or higher (for development)

### Development Dependencies

- TypeScript 5.7+
- ANTLR4 4.13.2 (for grammar parsing)
- ESLint 9.13.0 (for code linting)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/frgrisk/vor-stream-vscode-extension/issues) on our GitHub repository.
