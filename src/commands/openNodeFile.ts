import * as vscode from "vscode";
import * as path from "path";
import { openFirstExisting } from "../utils/fileUtils";

export function registerOpenNodeFileCommand(
  context: vscode.ExtensionContext,
): void {
  const openNodeFileCommand = vscode.commands.registerCommand(
    "extension.openNodeFile",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const document = editor.document;
      const lineText = document.lineAt(editor.selection.active.line).text;
      const currentFileDir = path.dirname(document.uri.fsPath);

      // Route based on line type: "in"/"input" → input file, "node"/"model" → implementation file
      const inMatch = lineText.match(/^\s*(?:IN|INPUT)\s+(\S+)\s*->/i);
      if (inMatch) {
        const source = inMatch[1]!;
        const isS3 = source.startsWith("s3://");
        const isDb = /\bdb\s*=/i.test(lineText);
        if (!isS3 && !isDb) {
          const baseName = path.basename(source).replace(/\.csv$/i, "");
          await openFirstExisting([
            path.join(currentFileDir, "input", `${baseName}.csv`),
            path.join(path.dirname(currentFileDir), "input", `${baseName}.csv`),
          ]);
        }
        return;
      }

      const nodeMatch = lineText.match(/\b(?:NODE|MODEL)\s+(\w+)/i);
      if (!nodeMatch) {
        return;
      }

      const nodeNameLower = nodeMatch[1]!.toLowerCase();
      const isPython = /lang\s*=\s*(python|py)/i.test(lineText);
      const possiblePaths = isPython
        ? [
            path.join(currentFileDir, "src", "python", `${nodeNameLower}U.py`),
            path.join(currentFileDir, "python", `${nodeNameLower}U.py`),
          ]
        : [
            path.join(
              currentFileDir,
              "src",
              "nodes",
              nodeNameLower,
              `${nodeNameLower}U.go`,
            ),
            path.join(
              currentFileDir,
              "nodes",
              nodeNameLower,
              `${nodeNameLower}U.go`,
            ),
          ];
      await openFirstExisting(possiblePaths);
    },
  );

  context.subscriptions.push(openNodeFileCommand);
}
