import * as vscode from "vscode";
import "./parser"; // keep parser module in bundle (used by diagnosticProvider)
import { registerInsertTemplateCommands } from "./commands/insertTemplate";
import { registerCompletionProvider } from "./providers/completionProvider";
import { registerOpenInputFileCommand } from "./commands/openInputFile";
import { registerOpenNodeFileCommand } from "./commands/openNodeFile";
import { registerCreateProcessCommand } from "./commands/createProcess";
import { registerRunProcessCommand } from "./commands/runProcess";
import { createDocumentSymbolProvider } from "./documentSymbolProvider";
import { registerDiagnosticProvider } from "./diagnosticProvider";
import { createHoverProvider } from "./hoverProvider";
import { CsvFileCache } from "./utils/csvFileCache";

export function activate(context: vscode.ExtensionContext) {
  const csvCache = new CsvFileCache(context);

  registerInsertTemplateCommands(context);
  registerDiagnosticProvider(context);
  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider(
      "strm",
      createDocumentSymbolProvider(),
    ),
  );
  context.subscriptions.push(
    vscode.languages.registerHoverProvider("strm", createHoverProvider()),
  );
  registerCompletionProvider(context, csvCache);
  registerOpenInputFileCommand(context);
  registerOpenNodeFileCommand(context);
  registerCreateProcessCommand(context);
  registerRunProcessCommand(context);
}

export function deactivate() {}
