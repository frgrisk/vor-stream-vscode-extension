import * as vscode from "vscode";
import * as path from "path";
import { openFirstExisting } from "../utils/fileUtils";

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
      if (/^db=/i.test(source) || /^DB$/i.test(source)) {
        vscode.window.showInformationMessage(
          "DB inputs cannot be opened locally.",
        );
        return;
      }

      const currentFileDir = path.dirname(document.uri.fsPath);
      const baseName = path.basename(source).replace(/\.csv$/i, "");
      await openFirstExisting([
        path.join(currentFileDir, "input", `${baseName}.csv`),
        path.join(path.dirname(currentFileDir), "input", `${baseName}.csv`),
      ]);
    },
  );

  context.subscriptions.push(openInputFileCommand);
}
