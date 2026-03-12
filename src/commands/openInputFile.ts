import * as vscode from "vscode";
import * as path from "path";
import { openInputCsv } from "../utils/fileUtils";

export function registerOpenInputFileCommand(
  context: vscode.ExtensionContext,
): void {
  const openInputFileCommand = vscode.commands.registerCommand(
    "extension.openInputFile",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const document = editor.document;
      const lineText = document.lineAt(editor.selection.active.line).text;

      const inMatch = lineText.match(/^\s*(?:IN|INPUT)\s+(\S+)\s*->/i);
      if (!inMatch) {
        vscode.window.showInformationMessage(
          "No input source found on the current line.",
        );
        return;
      }

      const source = inMatch[1]!;
      if (source.startsWith("s3://")) {
        vscode.window.showInformationMessage(
          "S3 inputs cannot be opened locally.",
        );
        return;
      }
      if (/\bdb\s*=/i.test(lineText)) {
        vscode.window.showInformationMessage(
          "DB inputs cannot be opened locally.",
        );
        return;
      }

      await openInputCsv(source, path.dirname(document.uri.fsPath));
    },
  );

  context.subscriptions.push(openInputFileCommand);
}
