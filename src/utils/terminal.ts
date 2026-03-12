import * as vscode from "vscode";

const VOR_TERMINAL_NAME = "VOR Terminal";

export function getOrCreateVorTerminal(): vscode.Terminal {
  return (
    vscode.window.terminals.find((t) => t.name === VOR_TERMINAL_NAME) ??
    vscode.window.createTerminal(VOR_TERMINAL_NAME)
  );
}