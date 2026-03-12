# Changelog

## [Unreleased]

### Added

- Pre-commit hooks for prettier, end-of-file-fixer, and trailing-whitespace
- `format` and `format:check` npm scripts
- Webpack bundling for extension distribution
- **What's New panel**: shows the current version's changelog section in a VS Code
  webview on first activation after an update; skips silently if the section is missing
- **Release pipeline**: release-please automation opens a Release PR on every push to
  `main`; a tag-triggered workflow lints, tests, packages the `.vsix`, and publishes
  via GoReleaser
- `@vscode/vsce` dev dependency and `vsce:package` npm script

### Changed

- Pinned prettier as a dev dependency for consistent formatting
- Updated CI to use `npm run format:check` instead of bare `npx prettier`
- Expanded CLAUDE.md with repository relationships, grammar sync workflow,
  and known bugs

## [0.1.0] - 2024-11-01

### Added

- Webpack build pipeline replacing plain TypeScript compilation
- GoReleaser configuration for automated releases
- Lime bullseye extension icon
- Enhanced extension manifest metadata (homepage, bugs URL, gallery banner)

## [0.0.1] - 2024-07-01

### Added

- Initial release
- Syntax highlighting for `.strm` files via TextMate grammar
- Auto-completion using ANTLR4-generated parser
- Navigation: F12 to jump to Go/Python node implementation files
- Template insertion for Go and Python process files
- VOR CLI integration (create process, run process)
- Support for CSV, DB, and S3 input/output snippets
