import * as vscode from "vscode";

const templates = {
  Go: `// Stream Go Template
name firstprocess
in input.csv -> input
node usernode(input)(output)
out output -> output.csv
`,
  Python: `// Stream Python Template
name testpy
in first.csv -> input
node usernodepy(input)(output) lang=python
out output -> output.csv
`,
};

async function insertTemplate(template: string) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor found.");
    return;
  }

  if (editor.document.languageId !== "strm") {
    vscode.window.showErrorMessage("This command only works for .strm files.");
    return;
  }

  const success = await editor.edit((editBuilder) => {
    editBuilder.insert(new vscode.Position(0, 0), template);
  });
  if (success) {
    vscode.window.showInformationMessage("Inserted .strm template.");
  } else {
    vscode.window.showErrorMessage("Failed to insert template.");
  }
}

export function registerInsertTemplateCommands(
  context: vscode.ExtensionContext,
): void {
  Object.entries(templates).forEach(([lang, template]) => {
    const commandId = `extension.insertTemplate${lang}`;
    const command = vscode.commands.registerCommand(commandId, () =>
      insertTemplate(template),
    );
    context.subscriptions.push(command);
  });
}
