import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { getTokensForCompletion } from "./parser";

export function activate(context: vscode.ExtensionContext) {
  // 🔹 Register commands dynamically for inserting templates
  registerCommands(context);

  const provider = vscode.languages.registerCompletionItemProvider("strm", {
    async provideCompletionItems(
      document: vscode.TextDocument,
      position: vscode.Position,
    ) {
      // Extract suggestions from the parse tree
      const suggestions: vscode.CompletionItem[] = [];
      const seenKeywords = new Set<string>();

      // Get the filename without the extension
      const fileName = path.parse(document.fileName).name;

      // Predefined completion items
      const predefinedCompletions = [
        // 🔹 NAME= Completion: Suggests filename
        {
          label: `name ${fileName}`,
          insertText: `name ${fileName}`,
          detail: "Suggests filename",
          kind: vscode.CompletionItemKind.Variable,
        },
        // 🔹 TYPE= Completion: Suggest MODEL, REPORT, DEFAULT
        {
          label: "type",
          insertText: "type ${1|Default,Report,Model|}",
          detail: "Select a type",
          kind: vscode.CompletionItemKind.Enum,
        },
        // 🔹 LANG= Completion: Suggest PYTHON, GO
        {
          label: "lang",
          insertText: "lang=${1|go,python|}",
          detail: "Select a language",
          kind: vscode.CompletionItemKind.Enum,
        },
        // 🔹 DB= Completion: Suggest PG, MSSQL
        {
          label: "db",
          insertText: "db=${1|PG,MSSQL|}",
          detail: "Select a database",
          kind: vscode.CompletionItemKind.Enum,
        },
        // 🔹 MODE= Completion: Suggest APPEND, REPLACE
        {
          label: "mode",
          insertText: "mode=${1|Append,Replace|}",
          detail: "Select a mode",
          kind: vscode.CompletionItemKind.Enum,
        },
      ];

      predefinedCompletions.forEach(({ label, insertText, detail, kind }) => {
        suggestions.push(createCompletionItem(label, insertText, detail, kind));
        seenKeywords.add(label.split(" ")[0]);
      });

      // 🔹 INPUT Completion: Provide step-by-step placeholders
      // Check the directory for CSV files after the user selects INPUT
      const inputDirectory = path.join(path.dirname(document.fileName), "input");
      const parentDirectory = path.join(
        path.dirname(path.dirname(document.fileName)),
        "input",
      );
      const directoriesToCheck = [inputDirectory, parentDirectory];
      const csvFiles: string[] = await getCSVFiles(directoriesToCheck);
      const csvFilesString =
        csvFiles.length > 0 ? csvFiles.join(",") : "first.csv";

      const snippetTemplates = [
        {
          type: "in",
          label: "CSV",
          snippet: `in \${1|${csvFilesString}|} -> \${2:input_queue}`,
          description: `CSV Input Template
> INPUT \${1|${csvFilesString}|} -> \${2:input_queue}
                                        `,
        },
        {
          type: "in",
          label: "DB",
          snippet: "in ${1:schema_name}.${2:table_name} -> ${3:input_queue}",
          description: descriptions["INPUT_DB"],
        },
        {
          type: "in",
          label: "S3",
          snippet: "in s3://${1:bucket_name}/${2:path} -> ${3:input_queue}",
          description: descriptions["INPUT_S3"],
        },
        {
          type: "out",
          label: "CSV",
          snippet: "out ${1:output_queue} -> ${2:output.csv}",
          description: descriptions["OUTPUT_CSV"],
        },
        {
          type: "out",
          label: "DB",
          snippet: "out ${1:output_queue} -> ${2:schema_name}.${3:table_name}",
          description: descriptions["OUTPUT_DB"],
        },
        {
          type: "out",
          label: "S3",
          snippet: "out ${1:output_queue} -> s3://${2:bucket_name}/${3:path}",
          description: descriptions["OUTPUT_S3"],
        },
      ];

      snippetTemplates.forEach(({ type, label, snippet, description }) => {
        suggestions.push(createSnippet(type, label, snippet, description));
        seenKeywords.add(type);
      });

      seenKeywords.add("in");
      seenKeywords.add("out");

      // 🔹 NODE Completion with Snippet
      const nodeItem = new vscode.CompletionItem(
        "node",
        vscode.CompletionItemKind.Keyword,
      );
      nodeItem.detail = "Define a NODE statement";
      nodeItem.documentation = new vscode.MarkdownString(
        "Defines a processing node with input and output queues.\n\n" +
          "```strm\nnode nodeName(input1)(output1)\n```",
      );
      nodeItem.insertText = new vscode.SnippetString(
        "node ${1:nodeName}(${2:input1})(${3:output1})$4",
      );

      suggestions.push(nodeItem);
      seenKeywords.add("node");

      const text = document.getText();
      const keywords = getTokensForCompletion(text); // Parse and get tokens

      // Auto-complete keywords extracted from ANTLR grammar
      keywords.forEach((keyword) => {
        if (!seenKeywords.has(keyword)) {
          suggestions.push(
            new vscode.CompletionItem(
              keyword,
              vscode.CompletionItemKind.Keyword,
            ),
          );
          seenKeywords.add(keyword);
        }
      });

      return suggestions;
    },
  });

  context.subscriptions.push(provider);

  const openInputFileCommand = vscode.commands.registerCommand(
    "extension.openInputFile",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const document = editor.document;
      const selection = editor.selection;
      const position = selection.active;

      // 🔹 Get the current line text
      const lineText = document.lineAt(position.line).text;

      // 🔹 Find "INPUT " in the line and extract the word after it
      const match = lineText.match(/\b(?:INPUT|IN)\s+(\w+)/i);
      if (!match || position.character <= match.index! + 4) {
        vscode.window.showErrorMessage(
          "No INPUT statement found at the cursor.",
        );
        return;
      }

      const inputName = match[1]; // Extracted node name
      // 🔹 Get workspace root
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
      if (!workspaceFolder) {
        vscode.window.showErrorMessage("No workspace folder found.");
        return;
      }

      // 🔹 Get the directory of the currently open file
      const currentFileDir = path.dirname(document.uri.fsPath);

      const filePath = path.join(workspaceFolder, "input", `${inputName}.csv`); // Workspace root/input

      // 🔹 Try opening the first existing file
      const fullPath = vscode.Uri.file(filePath);
      try {
        await vscode.workspace.fs.stat(fullPath); // Check if file exists
        vscode.window.showTextDocument(fullPath);
        return;
      } catch (err) {
        console.log(`File not found: ${filePath}`);
        vscode.window.showErrorMessage(`File not found: ${filePath}`);
      }

      vscode.window.showErrorMessage(
        `File not found in expected location:\n- ${filePath}`,
      );
    },
  );

  context.subscriptions.push(openInputFileCommand);

  const openNodeFileCommand = vscode.commands.registerCommand(
    "extension.openNodeFile",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const document = editor.document;
      const selection = editor.selection;
      const position = selection.active;

      // 🔹 Get the current line text
      const lineText = document.lineAt(position.line).text;

      // 🔹 Find "NODE " in the line and extract the word after it
      const match = lineText.match(/\bNODE\s+(\w+)/i);
      if (!match || position.character <= match.index! + 4) {
        vscode.window.showErrorMessage(
          "No NODE statement found at the cursor.",
        );
        return;
      }

      const nodeName = match[1]; // Extracted node name
      // 🔹 Get workspace root
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
      if (!workspaceFolder) {
        vscode.window.showErrorMessage("No workspace folder found.");
        return;
      }

      // 🔹 Get the directory of the currently open file
      const currentFileDir = path.dirname(document.uri.fsPath);

      // 🔹 Possible file locations
      const possiblePaths = [
        path.join(
          workspaceFolder,
          "src",
          "nodes",
          `${nodeName}`,
          `${nodeName}U.go`,
        ), // Workspace root/src
        path.join(currentFileDir, `${nodeName}`, "nodes", `${nodeName}U.go`), // Same directory as the .strm file
      ];

      // 🔹 Try opening the first existing file
      for (const filePath of possiblePaths) {
        const fullPath = vscode.Uri.file(filePath);
        try {
          await vscode.workspace.fs.stat(fullPath); // Check if file exists
          vscode.window.showTextDocument(fullPath);
          return;
        } catch (err) {
          console.log(`File not found: ${filePath}`);
        }
      }

      vscode.window.showErrorMessage(
        `File not found in expected locations:\n- ${possiblePaths.join("\n- ")}`,
      );
    },
  );

  context.subscriptions.push(openNodeFileCommand);

  let disposable = vscode.commands.registerCommand(
    "extension.createProcessCommand",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor.");
        return;
      }

      const filePath = path.parse(editor.document.fileName).name;

      // 🔹 Open a new terminal or reuse an existing one
      const terminal =
        vscode.window.terminals.find((t) => t.name === "VOR Terminal") ||
        vscode.window.createTerminal("VOR Terminal");
      terminal.show();

      // 🔹 Run "vor create process <filename>"
      terminal.sendText(`vor create process ${filePath}`);
    },
  );

  context.subscriptions.push(disposable);

  let runProcessCommand = vscode.commands.registerCommand(
    "extension.runProcessCommand",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor.");
        return;
      }

      const document = editor.document;
      const selection = editor.selection;
      const position = selection.active;

      // 🔹 Get the current line text
      const lineText = document.lineAt(position.line).text;

      // 🔹 Extract the process name after "NAME "
      const match = lineText.match(/\bNAME\s+(\w+)/i);
      if (!match || position.character <= match.index! + 4) {
        vscode.window.showErrorMessage("No process name found at cursor.");
        return;
      }

      const processName = match[1]; // Extracted process name

      // 🔹 Open a new terminal or reuse an existing one
      const terminal =
        vscode.window.terminals.find((t) => t.name === "VOR Terminal") ||
        vscode.window.createTerminal("VOR Terminal");
      terminal.show();

      // 🔹 Run "vor run process <processName>"
      terminal.sendText(`vor run ${processName}`);
    },
  );

  context.subscriptions.push(runProcessCommand);
}

export function deactivate() {}

// 🔹 Function to insert a template into the active editor
function insertTemplate(template: string) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor found.");
    return;
  }

  if (editor.document.languageId !== "strm") {
    vscode.window.showErrorMessage("This command only works for .strm files.");
    return;
  }

  editor
    .edit((editBuilder) => {
      editBuilder.insert(new vscode.Position(0, 0), template);
    })
    .then((success) => {
      const message = success
        ? "Inserted .strm template."
        : "Failed to insert template.";
      success
        ? vscode.window.showInformationMessage(message)
        : vscode.window.showErrorMessage(message);
    });
}

// 🔹 Function to create a completion item
function createCompletionItem(
  label: string,
  insertText: string,
  detail: string,
  kind: vscode.CompletionItemKind,
): vscode.CompletionItem {
  const item = new vscode.CompletionItem(label, kind);
  item.insertText = new vscode.SnippetString(insertText);
  item.detail = detail;
  return item;
}

// 🔹 Function to create INPUT completion items with step-by-step placeholders
function createSnippet(
  type: string,
  label: string,
  snippet: string,
  description: string,
): vscode.CompletionItem {
  const item = new vscode.CompletionItem(
    `${type} (${label})`,
    vscode.CompletionItemKind.Snippet,
  );
  item.insertText = new vscode.SnippetString(snippet);
  item.detail = description;
  return item;
}

async function getCSVFiles(directories: string[]): Promise<string[]> {
  const csvFiles = await Promise.all(
    directories.map(async (dir) => {
      try {
        const files = await fs.promises.readdir(dir);
        return files.filter((file) => file.endsWith(".csv"));
      } catch (err) {
        console.error(`Error reading directory ${dir}: ${err}`);
        return [];
      }
    }),
  );

  return csvFiles.flat();
}

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

const descriptions = {
  // 'INPUT_CSV': ``,
  INPUT_DB: `Database Input Template
> input schemaname.table_name -> input_queue
                        `,
  INPUT_S3: `S3 Input Template
> input s3://bucket_name/path -> input_queue
                        `,
  OUTPUT_CSV: `CSV Output Template
> output output_queue -> output.csv                    
                        `,
  OUTPUT_DB: `Database Output Template
> output output_queue -> schemaname.table_name                    
                        `,
  OUTPUT_S3: `S3 Output Template
> output output_queue -> s3://bucket_name/path                    
                        `,
};

function registerCommands(context: vscode.ExtensionContext) {
  Object.entries(templates).forEach(([lang, template]) => {
    const commandId = `extension.insertTemplate${lang}`;
    const command = vscode.commands.registerCommand(commandId, () =>
      insertTemplate(template),
    );
    context.subscriptions.push(command);
  });
}
