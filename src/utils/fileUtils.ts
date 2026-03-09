import * as vscode from "vscode";
import * as fs from "fs";

export async function openFirstExisting(
  possiblePaths: string[],
): Promise<void> {
  for (const filePath of possiblePaths) {
    const uri = vscode.Uri.file(filePath);
    try {
      await vscode.workspace.fs.stat(uri);
      vscode.window.showTextDocument(uri);
      return;
    } catch (_err) {
      console.log(`File not found: ${filePath}`);
    }
  }
  vscode.window.showInformationMessage(
    `File not found in expected locations: ${possiblePaths.join(", ")}`,
  );
}

export async function getCSVFiles(directories: string[]): Promise<string[]> {
  const csvFiles = await Promise.all(
    directories.map(async (dir) => {
      try {
        const files = await fs.promises.readdir(dir);
        return files.filter((file) => file.endsWith(".csv"));
      } catch (_err) {
        console.error(`Error reading directory ${dir}: ${_err}`);
        return [];
      }
    }),
  );

  return csvFiles.flat();
}
