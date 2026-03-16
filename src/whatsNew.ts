import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { randomBytes } from "crypto";

/**
 * Extracts the changelog section for the given version from a Keep-a-Changelog
 * formatted markdown string. Returns an empty string if the version is not found.
 */
export function parseChangelogSection(
  markdown: string,
  version: string,
): string {
  const escaped = version.replace(/\./g, "\\.");
  const startPattern = new RegExp(`^## \\[${escaped}\\]`, "m");
  const startMatch = startPattern.exec(markdown);
  if (!startMatch) {
    return "";
  }

  const afterStart = markdown.slice(startMatch.index + startMatch[0].length);
  const nextSectionMatch = /^## \[/m.exec(afterStart);
  const section = nextSectionMatch
    ? afterStart.slice(0, nextSectionMatch.index)
    : afterStart;

  return (`## [${version}]` + section).trim();
}

/** Escapes HTML special characters to prevent XSS when injecting into a webview. */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function shouldShowWhatsNew(
  context: vscode.ExtensionContext,
  currentVersion: string,
): boolean {
  return context.globalState.get<string>("lastSeenVersion") !== currentVersion;
}

/**
 * Converts a markdown changelog section to an HTML fragment.
 * Handles headings, unordered lists (both `*` and `-` bullets), inline code,
 * bold text, and strips `[text](url)` link syntax (links are not navigable in
 * the webview).
 */
export function markdownToHtml(markdownSection: string): string {
  // Strip markdown link syntax ([text](url) → text) before HTML-escaping,
  // since links are not navigable in the webview and clutter the output.
  const stripped = markdownSection.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // HTML-escape first, then apply structural markdown → HTML conversions.
  // Order matters: escape raw content before wrapping in tags.
  return escapeHtml(stripped)
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^[*-] (.+)$/gm, "<li>$1</li>")
    .replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function getWebviewContent(markdownSection: string, version: string): string {
  const html = markdownToHtml(markdownSection);

  const nonce = randomBytes(16).toString("hex");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'nonce-${nonce}';">
  <title>What&#39;s New in VOR Stream v${escapeHtml(version)}</title>
  <style nonce="${nonce}">
    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      padding: 20px 28px;
      max-width: 760px;
    }
    h2 { color: var(--vscode-textLink-foreground); margin-top: 0; }
    h3 { margin-top: 16px; }
    h4 { margin-top: 12px; }
    ul { padding-left: 20px; margin: 6px 0; }
    li { margin: 4px 0; }
    code {
      background: var(--vscode-textCodeBlock-background);
      padding: 1px 5px;
      border-radius: 3px;
      font-family: var(--vscode-editor-font-family);
    }
  </style>
</head>
<body>
${html}
</body>
</html>`;
}

export async function showWhatsNewPanel(
  context: vscode.ExtensionContext,
  currentVersion: string,
): Promise<void> {
  // vsce lowercases CHANGELOG.md → changelog.md in the packaged vsix;
  // try both so the feature works when installed and during local dev.
  const candidates = ["CHANGELOG.md", "changelog.md"];
  let section = "";
  for (const name of candidates) {
    try {
      const markdown = await fs.promises.readFile(
        path.join(context.extensionPath, name),
        "utf-8",
      );
      section = parseChangelogSection(markdown, currentVersion);
      break;
    } catch {
      // try next candidate
    }
  }

  if (!section) {
    // Version not found in changelog — skip silently, do not mark as seen
    return;
  }

  const panel = vscode.window.createWebviewPanel(
    "vorStreamWhatsNew",
    `What's New — VOR Stream v${currentVersion}`,
    vscode.ViewColumn.One,
    { enableScripts: false },
  );

  panel.webview.html = getWebviewContent(section, currentVersion);
  try {
    await context.globalState.update("lastSeenVersion", currentVersion);
  } catch (error) {
    // If storage write fails, ignore so the panel shows again next activation
    console.error("Failed to update lastSeenVersion in globalState:", error);
  }
}
