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
      errors.map(({ line, column, length, message }) => {
        const start = new vscode.Position(line - 1, column);
        const end = new vscode.Position(line - 1, column + length);
        return new vscode.Diagnostic(
          new vscode.Range(start, end),
          message,
          vscode.DiagnosticSeverity.Error,
        );
      }),
    );
  }

  function scheduleUpdate(document: vscode.TextDocument): void {
    if (document.languageId !== "strm") {
      return;
    }
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
    vscode.workspace.onDidOpenTextDocument(scheduleUpdate),
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

  // Parse documents already open when the extension activates.
  vscode.workspace.textDocuments.forEach(scheduleUpdate);
}
