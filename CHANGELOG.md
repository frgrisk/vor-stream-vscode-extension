# Changelog

## [Unreleased]

### Added

- Pre-commit hooks for prettier, end-of-file-fixer, and trailing-whitespace
- `format` and `format:check` npm scripts
- Webpack bundling for extension distribution

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
