import * as assert from "assert";
import {
  parseChangelogSection,
  escapeHtml,
  markdownToHtml,
} from "../../whatsNew";

const SAMPLE_CHANGELOG = `# Changelog

## [Unreleased]

### Added

- Upcoming feature

## [0.2.0] - 2026-03-12

### Added

- Hover provider with keyword docs
- Context-aware completions for model/SAS blocks

### Fixed

- TOCTOU in openFirstExisting — removed redundant stat()

## [0.1.0] - 2024-11-01

### Added

- Initial release
- Syntax highlighting for \`.strm\` files
`;

suite("parseChangelogSection", () => {
  test("returns section for an existing version", () => {
    const result = parseChangelogSection(SAMPLE_CHANGELOG, "0.2.0");
    assert.ok(result.includes("Hover provider"), "should include Added items");
    assert.ok(result.includes("TOCTOU"), "should include Fixed items");
  });

  test("does not bleed into the next version section", () => {
    const result = parseChangelogSection(SAMPLE_CHANGELOG, "0.2.0");
    assert.ok(
      !result.includes("Initial release"),
      "should not contain 0.1.0 content",
    );
    assert.ok(!result.includes("0.1.0"), "should not contain the 0.1.0 header");
  });

  test("does not bleed into [Unreleased] content", () => {
    const result = parseChangelogSection(SAMPLE_CHANGELOG, "0.2.0");
    assert.ok(
      !result.includes("Upcoming feature"),
      "should not contain Unreleased content",
    );
  });

  test("returns empty string for a version not in the changelog", () => {
    const result = parseChangelogSection(SAMPLE_CHANGELOG, "9.9.9");
    assert.strictEqual(result, "");
  });

  test("parses the last section with no following version header", () => {
    const result = parseChangelogSection(SAMPLE_CHANGELOG, "0.1.0");
    assert.ok(
      result.includes("Initial release"),
      "should include 0.1.0 content",
    );
    assert.ok(
      !result.includes("Hover provider"),
      "should not contain 0.2.0 content",
    );
  });

  test("handles version with multiple dots (no regex escaping leak)", () => {
    const changelog = `# Changelog\n\n## [1.10.0] - 2026-01-01\n\n- Feature X\n\n## [1.1.0] - 2025-01-01\n\n- Feature Y\n`;
    const result = parseChangelogSection(changelog, "1.10.0");
    assert.ok(result.includes("Feature X"));
    assert.ok(!result.includes("Feature Y"));
  });

  test("returns section header as first line", () => {
    const result = parseChangelogSection(SAMPLE_CHANGELOG, "0.2.0");
    assert.ok(result.startsWith("## [0.2.0]"));
  });

  test("returns empty string for empty changelog", () => {
    const result = parseChangelogSection("", "0.1.0");
    assert.strictEqual(result, "");
  });
});

suite("escapeHtml", () => {
  test("escapes ampersand", () => {
    assert.strictEqual(escapeHtml("a & b"), "a &amp; b");
  });

  test("escapes less-than and greater-than", () => {
    assert.strictEqual(escapeHtml("<script>"), "&lt;script&gt;");
  });

  test("escapes double quotes", () => {
    assert.strictEqual(escapeHtml('"quoted"'), "&quot;quoted&quot;");
  });

  test("escapes single quotes", () => {
    assert.strictEqual(escapeHtml("it's"), "it&#39;s");
  });

  test("escapes all special chars together", () => {
    assert.strictEqual(
      escapeHtml(`<img src="x" onerror='alert(1)' & more>`),
      "&lt;img src=&quot;x&quot; onerror=&#39;alert(1)&#39; &amp; more&gt;",
    );
  });

  test("leaves plain text unchanged", () => {
    assert.strictEqual(escapeHtml("hello world"), "hello world");
  });
});

suite("markdownToHtml", () => {
  test("renders dash list items as <li>", () => {
    const result = markdownToHtml("- item one\n- item two");
    assert.ok(result.includes("<li>item one</li>"), "dash bullets → <li>");
    assert.ok(result.includes("<li>item two</li>"));
  });

  test("renders asterisk list items as <li>", () => {
    const result = markdownToHtml("* item one\n* item two");
    assert.ok(result.includes("<li>item one</li>"), "asterisk bullets → <li>");
    assert.ok(result.includes("<li>item two</li>"));
  });

  test("wraps consecutive list items in <ul>", () => {
    const result = markdownToHtml("* a\n* b\n* c");
    assert.ok(result.includes("<ul>"), "list items wrapped in <ul>");
    assert.ok(result.includes("</ul>"));
  });

  test("strips markdown link syntax, keeping display text", () => {
    const result = markdownToHtml("See [release notes](https://example.com).");
    assert.ok(
      result.includes("See release notes."),
      "link text preserved, URL removed",
    );
    assert.ok(!result.includes("https://example.com"), "URL removed");
  });

  test("strips link inside a list item", () => {
    const result = markdownToHtml("* Fix [#42](https://github.com/issues/42)");
    assert.ok(
      result.includes("<li>Fix #42</li>"),
      "link stripped in list item",
    );
  });

  test("renders headings", () => {
    const result = markdownToHtml("## Added\n### Changed\n#### Internal");
    assert.ok(result.includes("<h2>Added</h2>"));
    assert.ok(result.includes("<h3>Changed</h3>"));
    assert.ok(result.includes("<h4>Internal</h4>"));
  });

  test("renders inline code", () => {
    const result = markdownToHtml("Use `foo()` here.");
    assert.ok(result.includes("<code>foo()</code>"));
  });

  test("renders bold text", () => {
    const result = markdownToHtml("**important** note");
    assert.ok(result.includes("<strong>important</strong>"));
  });

  test("HTML-escapes special chars before applying transforms", () => {
    const result = markdownToHtml("- item with <script> & 'quotes'");
    assert.ok(!result.includes("<script>"), "raw <script> tag escaped");
    assert.ok(result.includes("&lt;script&gt;"), "angle brackets escaped");
    assert.ok(result.includes("&amp;"), "ampersand escaped");
  });
});
