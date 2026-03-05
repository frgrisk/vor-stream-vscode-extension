import * as vscode from "vscode";
import { getParseErrors } from "./parser";

export function registerDiagnosticProvider(
  context: vscode.ExtensionContext,
): void {
  const diagnostics = vscode.languages.createDiagnosticCollection("strm");
  context.subscriptions.push(diagnostics);

  const timers = new Map<string, ReturnType<typeof setTimeout>>();

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
    vscode.workspace.onDidChangeTextDocument((e) =>
      scheduleUpdate(e.document),
    ),
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

  // Run on already-open documents (e.g. reopening VS Code with a .strm file)
  vscode.workspace.textDocuments.forEach(updateDiagnostics);
}
