import * as vscode from "vscode";

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

      // Open a new terminal or reuse an existing one
      const terminal =
        vscode.window.terminals.find((t) => t.name === "VOR Terminal") ||
        vscode.window.createTerminal("VOR Terminal");
      terminal.show();

      // Run "vor run process <processName>"
      terminal.sendText(`vor run ${processName}`);
    },
  );

  context.subscriptions.push(runProcessCommand);
}
