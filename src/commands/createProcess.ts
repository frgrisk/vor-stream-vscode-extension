import * as vscode from "vscode";
import * as path from "path";
import { getOrCreateVorTerminal } from "../utils/terminal";

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

      const terminal = getOrCreateVorTerminal();
      terminal.show();

      // Run "vor create process <filename>"
      terminal.sendText(`vor create process ${filePath}`);
    },
  );

  context.subscriptions.push(disposable);
}
