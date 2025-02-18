# VOR Stream

VOR Stream is a Visual Studio Code extension designed for syntax highlighting
and auto-completion of `.strm` files used in VOR Stream processes. The
extension provides suggestions based on your grammar and predefined templates,
as well as custom completions for commonly used keywords.

## Features

- **Syntax Highlighting**
  - Automatic syntax highlighting for `.strm` files
  - Support for process-specific keywords and constructs

- **Intelligent Auto-Completion**
  - Context-aware suggestions based on your grammar
  - Common keywords like `NAME`, `TYPE=`, `LANG=`
  - Process-specific completions

- **Template Support**
  - Quick insertion of process templates for Go and Python
  - Command palette integration

- **Navigation**
  - Go to node file (`F12`)
  - Go to input file
  - Create and run process commands

## Installation

### VS Code Marketplace
1. Open Visual Studio Code
2. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS) to open Extensions
3. Search for "VOR Stream"
4. Click Install

### Manual Installation

```bash
# Clone this repository:

git clone git@github.com:frgrisk/vor-stream-vscode-extension.git
cd vor-stream-vscode-extension

# Install dependencies:

npm install

# Compile the extension:

npm run compile

# Open the extension in VSCode and press F5 to launch a new VSCode window with the loaded extension.
```

## Requirements

- Visual Studio Code 1.73.0 or higher
- Node.js 16.x or higher (for development)

### Development Dependencies
- TypeScript 5.7+
- ANTLR4 4.13.2 (for grammar parsing)
- ESLint 9.13.0 (for code linting)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/frgrisk/vor-stream-vscode-extension/issues) on our GitHub repository.