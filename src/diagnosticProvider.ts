import * as vscode from "vscode";
import { getParseErrors } from "./parser";

export function registerDiagnosticProvider(
  context: vscode.ExtensionContext,
): void {
  const diagnostics = vscode.languages.createDiagnosticCollection("strm");
  context.subscriptions.push(diagnostics);

  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  context.subscriptions.push({
    dispose() {
      timers.forEach(clearTimeout);
      timers.clear();
    },
  });

  function updateDiagnostics(document: vscode.TextDocument): void {
    if (document.languageId !== "strm") {
      return;
    }
    const errors = getParseErrors(document.getText());
    diagnostics.set(
      document.uri,
      errors.map(({ line, column, message }) => {
        const pos = new vscode.Position(line - 1, column);
        return new vscode.Diagnostic(
          new vscode.Range(pos, pos),
          message,
          vscode.DiagnosticSeverity.Error,
        );
      }),
    );
  }

  function scheduleUpdate(document: vscode.TextDocument): void {
    const key = document.uri.toString();
    const existing = timers.get(key);
    if (existing !== undefined) {
      clearTimeout(existing);
    }
    timers.set(
      key,
      setTimeout(() => {
        timers.delete(key);
        updateDiagnostics(document);
      }, 500),
    );
  }

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(updateDiagnostics),
    vscode.workspace.onDidChangeTextDocument((e) => scheduleUpdate(e.document)),
    vscode.workspace.onDidCloseTextDocument((doc) => {
      diagnostics.delete(doc.uri);
      const key = doc.uri.toString();
      const existing = timers.get(key);
      if (existing !== undefined) {
        clearTimeout(existing);
        timers.delete(key);
      }
    }),
  );

  // Catch documents already open when the extension activates.
  // onDidOpenTextDocument replays them, but scheduling here ensures they
  // are debounced and not parsed twice if VS Code fires both.
  vscode.workspace.textDocuments.forEach(scheduleUpdate);
}
