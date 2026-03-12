import * as vscode from "vscode";
import * as path from "path";

export async function openFirstExisting(
  possiblePaths: string[],
): Promise<void> {
  for (const filePath of possiblePaths) {
    const uri = vscode.Uri.file(filePath);
    try {
      await vscode.window.showTextDocument(uri);
      return;
    } catch (err) {
      console.debug(`File not found: ${filePath}`, err);
    }
  }
  vscode.window.showInformationMessage(
    `File not found in expected locations: ${possiblePaths.join(", ")}`,
  );
}

export async function openInputCsv(
  source: string,
  fromDir: string,
): Promise<void> {
  const baseName = path.basename(source).replace(/\.csv$/i, "");
  await openFirstExisting([
    path.join(fromDir, "input", `${baseName}.csv`),
    path.join(path.dirname(fromDir), "input", `${baseName}.csv`),
  ]);
}
