import * as vscode from "vscode";
import * as fs from "fs";

/**
 * Returns a CSV file cache for a given set of directories.
 * The cache subscribes to a FileSystemWatcher on the workspace and
 * invalidates whenever a .csv file is created, deleted, or renamed.
 */
export class CsvFileCache {
  private cache: Map<string, string[]> = new Map();
  private watcher: vscode.FileSystemWatcher;

  constructor(context: vscode.ExtensionContext) {
    this.watcher = vscode.workspace.createFileSystemWatcher("**/*.csv");
    this.watcher.onDidCreate(() => this.invalidate());
    this.watcher.onDidDelete(() => this.invalidate());
    this.watcher.onDidChange(() => this.invalidate());
    context.subscriptions.push(this.watcher);
  }

  private invalidate(): void {
    this.cache.clear();
  }

  async getFiles(directories: string[]): Promise<string[]> {
    const key = directories.sort().join("|");
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }
    const files = await this.fetchFiles(directories);
    this.cache.set(key, files);
    return files;
  }

  private async fetchFiles(directories: string[]): Promise<string[]> {
    const results = await Promise.all(
      directories.map(async (dir) => {
        try {
          const entries = await fs.promises.readdir(dir);
          return entries.filter((f) => f.endsWith(".csv"));
        } catch {
          return [];
        }
      }),
    );
    return results.flat();
  }
}
