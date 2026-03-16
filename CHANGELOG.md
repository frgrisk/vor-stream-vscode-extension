# Changelog

## [26.1.0](https://github.com/frgrisk/vor-stream-vscode-extension/compare/vor-stream-v26.0.0...vor-stream-v26.1.0) (2026-03-16)


### Features

* able to drill into Python nodes ([9c12f48](https://github.com/frgrisk/vor-stream-vscode-extension/commit/9c12f4881915c1209206b916c282226760c0cd36))
* add automated test infrastructure with Mocha and @vscode/test-electron ([#22](https://github.com/frgrisk/vor-stream-vscode-extension/issues/22)) ([75f2286](https://github.com/frgrisk/vor-stream-vscode-extension/commit/75f2286b5ec76010c2453df6703225dbbe189b02))
* add hover provider for .strm keywords ([#28](https://github.com/frgrisk/vor-stream-vscode-extension/issues/28)) ([f294000](https://github.com/frgrisk/vor-stream-vscode-extension/commit/f294000d7975eecee35fae193fadd6fccf870688))
* cache CSV file scan with FileSystemWatcher ([#26](https://github.com/frgrisk/vor-stream-vscode-extension/issues/26)) ([330fada](https://github.com/frgrisk/vor-stream-vscode-extension/commit/330fada8705e2c71a2c0f802bfff53dba7ac5227))
* context-aware completion provider for .strm files ([#27](https://github.com/frgrisk/vor-stream-vscode-extension/issues/27)) ([7770741](https://github.com/frgrisk/vor-stream-vscode-extension/commit/777074193308002981604a00142a670f7ab75eae))
* diagnostic provider for syntax error squiggles ([#20](https://github.com/frgrisk/vor-stream-vscode-extension/issues/20)) ([a807177](https://github.com/frgrisk/vor-stream-vscode-extension/commit/a8071775bde906cd8edfe8a579d0b87d97ed2aaf))
* document symbol provider (Outline panel) ([#19](https://github.com/frgrisk/vor-stream-vscode-extension/issues/19)) ([bc0624c](https://github.com/frgrisk/vor-stream-vscode-extension/commit/bc0624c0d4df79138c3d3303e1af126033b680ec))
* enhance extension manifest, add lime bullseye icon, switch to webpack builds ([#8](https://github.com/frgrisk/vor-stream-vscode-extension/issues/8)) ([d8258af](https://github.com/frgrisk/vor-stream-vscode-extension/commit/d8258afb8782c22c218d975834274dd8a9b352bb))
* release pipeline, What's New panel, and 14 new tests ([#31](https://github.com/frgrisk/vor-stream-vscode-extension/issues/31)) ([3ce354e](https://github.com/frgrisk/vor-stream-vscode-extension/commit/3ce354ed3ed65cbfd2edada467c888d1592bc006))
* sync extension with grammar — add missing keyword support ([2554c88](https://github.com/frgrisk/vor-stream-vscode-extension/commit/2554c88d7e41d23fb249555f488c999bf60a7832))
* sync extension with vor-stream grammar VS-1390 snake_case rename ([#35](https://github.com/frgrisk/vor-stream-vscode-extension/issues/35)) ([41a4401](https://github.com/frgrisk/vor-stream-vscode-extension/commit/41a44016af561d26c68a6c33089151e871c26353))


### Bug Fixes

* bumps MICRO, and the major (YY) is manually bumped each year. ([ef07a2b](https://github.com/frgrisk/vor-stream-vscode-extension/commit/ef07a2b535e87c0f5fa7c6426ff89bd5d5b72232))
* cannot drill into nodes if node name is not lowercased ([0a0d794](https://github.com/frgrisk/vor-stream-vscode-extension/commit/0a0d7945606ad712170a7347c5bacdc54c30bc27))
* extend model symbol range to include continuation lines ([#23](https://github.com/frgrisk/vor-stream-vscode-extension/issues/23)) ([1c00913](https://github.com/frgrisk/vor-stream-vscode-extension/commit/1c00913cf69673181fbcbfae273852eccc2827d0))
* INPUT completion is searching for wrong input directory ([534c2ac](https://github.com/frgrisk/vor-stream-vscode-extension/commit/534c2ac1c600a7711ce7d4a8e6bbe0ea6b006e94))
* Open Input File is searching for wrong input directory ([3671dc9](https://github.com/frgrisk/vor-stream-vscode-extension/commit/3671dc96a5c6eb269e2023853ff84a7f68f4a468))
* render asterisk list items and strip markdown links in What's New panel ([#37](https://github.com/frgrisk/vor-stream-vscode-extension/issues/37)) ([f63c449](https://github.com/frgrisk/vor-stream-vscode-extension/commit/f63c4493324d3415984f7da165cd592d8f52aed7))
* replace migration warnings with 'not supported' for legacy keywords ([#39](https://github.com/frgrisk/vor-stream-vscode-extension/issues/39)) ([6ca97a3](https://github.com/frgrisk/vor-stream-vscode-extension/commit/6ca97a3aefc5b305845a3f2cf924ab3f18d21ce1))
* resolve high-severity npm vulnerabilities ([a7e690e](https://github.com/frgrisk/vor-stream-vscode-extension/commit/a7e690e8c16bd0b50e084cbb0f56bf55872cd6a3))
* scan full document for process name in runProcessCommand ([6ecb033](https://github.com/frgrisk/vor-stream-vscode-extension/commit/6ecb033a0bcca506c1bd63ca378284cb7c4513e2))
* scope F12 to strm files, remove noop manifest field, clean up extension.ts ([#15](https://github.com/frgrisk/vor-stream-vscode-extension/issues/15)) ([d603a55](https://github.com/frgrisk/vor-stream-vscode-extension/commit/d603a551afdfd728cad78aa9997d4acb65555738))
* update GoReleaser config for webpack bundling ([#9](https://github.com/frgrisk/vor-stream-vscode-extension/issues/9)) ([bb85d04](https://github.com/frgrisk/vor-stream-vscode-extension/commit/bb85d0498c655f883a86d318c9f1181663e04408))

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
