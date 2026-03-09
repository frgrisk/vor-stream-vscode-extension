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
      const position = editor.selection.active;

      // Get the current line text
      const lineText = document.lineAt(position.line).text;

      // Extract the process name after "NAME "
      const match = lineText.match(/\bNAME\s+(\w+)/i);
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
