import * as vscode from "vscode";
import * as path from "path";

export function registerCreateProcessCommand(
  context: vscode.ExtensionContext,
): void {
  const disposable = vscode.commands.registerCommand(
    "extension.createProcessCommand",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor.");
        return;
      }

      const filePath = path.parse(editor.document.fileName).name;

      // Open a new terminal or reuse an existing one
      const terminal =
        vscode.window.terminals.find((t) => t.name === "VOR Terminal") ||
        vscode.window.createTerminal("VOR Terminal");
      terminal.show();

      // Run "vor create process <filename>"
      terminal.sendText(`vor create process ${filePath}`);
    },
  );

  context.subscriptions.push(disposable);
}
