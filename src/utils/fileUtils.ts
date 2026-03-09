import * as vscode from "vscode";
import * as fs from "fs";

export async function openFirstExisting(
  possiblePaths: string[],
): Promise<void> {
  for (const filePath of possiblePaths) {
    const uri = vscode.Uri.file(filePath);
    try {
      await vscode.workspace.fs.stat(uri);
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

export async function getCSVFiles(directories: string[]): Promise<string[]> {
  const csvFiles = await Promise.all(
    directories.map(async (dir) => {
      try {
        const files = await fs.promises.readdir(dir);
        return files.filter((file) => file.endsWith(".csv"));
      } catch (err) {
        const e = err as NodeJS.ErrnoException;
        if (e.code !== "ENOENT") {
          console.warn(`fileUtils: could not read ${dir}:`, err);
        }
        return [];
      }
    }),
  );

  return csvFiles.flat();
}
