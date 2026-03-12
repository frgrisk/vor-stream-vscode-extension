import * as vscode from "vscode";
import { getOrCreateVorTerminal } from "../utils/terminal";

export function registerRunProcessCommand(
  context: vscode.ExtensionContext,
): void {
  const runProcessCommand = vscode.commands.registerCommand(
    "extension.runProcessCommand",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor.");
        return;
      }

      const document = editor.document;

      // Scan the entire document for the process name declaration
      const fullText = document.getText();
      const match = fullText.match(/^name\s+(\w+)/im);
      if (!match) {
        return;
      }

      const processName = match[1]; // Extracted process name

      const terminal = getOrCreateVorTerminal();
      terminal.show();

      // Run "vor run process <processName>"
      terminal.sendText(`vor run ${processName}`);
    },
  );

  context.subscriptions.push(runProcessCommand);
}
