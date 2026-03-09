import * as vscode from "vscode";
import * as path from "path";
import { getTokensForCompletion } from "./parser";
import { CsvFileCache } from "./utils/csvFileCache";
import { createDocumentSymbolProvider } from "./documentSymbolProvider";
import { registerDiagnosticProvider } from "./diagnosticProvider";
import { createHoverProvider } from "./hoverProvider";

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

export interface ICsvFileCache {
  getFiles(directories: string[]): Promise<string[]>;
}

export function createCompletionProvider(
  csvCache: ICsvFileCache,
): vscode.CompletionItemProvider {
  return {
    async provideCompletionItems(
      document: vscode.TextDocument,
      position: vscode.Position,
      _token: vscode.CancellationToken,
      context: vscode.CompletionContext,
    ) {
      const suggestions: vscode.CompletionItem[] = [];
      const seenKeywords = new Set<string>();

      const fileName = path.parse(document.fileName).name;

      // Determine context from the line text up to the cursor
      const linePrefix = document
        .lineAt(position)
        .text.slice(0, position.character);
      const lineTrimmed = linePrefix.trimStart();

      // Appends ANTLR token completions, skipping already-seen keywords
      const addAntlrTokens = () => {
        const keywords = getTokensForCompletion(document.getText());
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
      };

      // in-line context: offer only in snippet variants
      if (/^in(?:put)?\s/i.test(lineTrimmed)) {
        const inputDirectory = path.join(
          path.dirname(document.fileName),
          "input",
        );
        const parentDirectory = path.join(
          path.dirname(path.dirname(document.fileName)),
          "input",
        );
        const directoriesToCheck = [inputDirectory, parentDirectory];
        const csvFiles: string[] = await csvCache.getFiles(directoriesToCheck);
        const csvFilesString =
          csvFiles.length > 0 ? csvFiles.join(",") : "first.csv";
        [
          {
            label: "CSV",
            snippet: `\${1|${csvFilesString}|} -> \${2:input_queue}`,
            description: `CSV Input Template\n> INPUT \${1|${csvFilesString}|} -> \${2:input_queue}\n`,
          },
          {
            label: "DB",
            snippet: "${1:schema_name}.${2:table_name} -> ${3:input_queue}",
            description: descriptions["INPUT_DB"],
          },
          {
            label: "S3",
            snippet: "s3://${1:bucket_name}/${2:path} -> ${3:input_queue}",
            description: descriptions["INPUT_S3"],
          },
        ].forEach(({ label, snippet, description }) => {
          suggestions.push(createSnippet("in", label, snippet, description));
          seenKeywords.add("in");
        });
        return suggestions;
      }

      // out-line context: offer only out snippet variants
      if (/^out(?:put)?\s/i.test(lineTrimmed)) {
        [
          {
            label: "CSV",
            snippet: "${1:output_queue} -> ${2:output.csv}",
            description: descriptions["OUTPUT_CSV"],
          },
          {
            label: "DB",
            snippet: "${1:output_queue} -> ${2:schema_name}.${3:table_name}",
            description: descriptions["OUTPUT_DB"],
          },
          {
            label: "S3",
            snippet: "${1:output_queue} -> s3://${2:bucket_name}/${3:path}",
            description: descriptions["OUTPUT_S3"],
          },
        ].forEach(({ label, snippet, description }) => {
          suggestions.push(createSnippet("out", label, snippet, description));
          seenKeywords.add("out");
        });
        return suggestions;
      }

      // When triggered by space and not in an in/out context, suppress completions
      // to avoid noisy suggestions on every space keystroke
      if (
        context.triggerKind ===
          vscode.CompletionTriggerKind.TriggerCharacter &&
        context.triggerCharacter === " "
      ) {
        return suggestions;
      }

      // node-after-parens context: offer lang= option
      if (/^node\s+\w+\([^)]*\)\([^)]*\)/i.test(lineTrimmed)) {
        suggestions.push(
          createCompletionItem(
            "lang",
            "lang=${1|go,python|}",
            "Select a language",
            vscode.CompletionItemKind.Enum,
          ),
        );
        seenKeywords.add("lang");
        addAntlrTokens();
        return suggestions;
      }

      // Model continuation: on the model line itself, or on an indented line
      // within 5 lines of a model statement
      const isModelLine = /^model\s/i.test(lineTrimmed);
      const isIndented = linePrefix.length > lineTrimmed.length;
      let isModelContinuation = isModelLine;
      if (!isModelContinuation && isIndented) {
        for (
          let i = position.line - 1;
          i >= Math.max(0, position.line - 10);
          i--
        ) {
          const prevLine = document.lineAt(i).text;
          const prevTrimmed = prevLine.trim();
          if (/^model\s/i.test(prevTrimmed)) {
            isModelContinuation = true;
            break;
          }
          // Stop if we hit a non-indented, non-empty line (top-level statement)
          if (prevTrimmed !== "" && prevLine.length === prevTrimmed.length) {
            break;
          }
        }
      }

      if (isModelContinuation) {
        [
          {
            label: "exceptq",
            insertText: "exceptq=${1:exception_queue}",
            detail: "Exception queue for model nodes",
            kind: vscode.CompletionItemKind.Property,
          },
          {
            label: "scenario",
            insertText: "scenario=${1|true,false|}",
            detail: "Enable scenario for model nodes",
            kind: vscode.CompletionItemKind.Enum,
          },
          {
            label: "unittest",
            insertText: "unittest=${1|true,false|}",
            detail: "Enable unit test for model nodes",
            kind: vscode.CompletionItemKind.Enum,
          },
          {
            label: "modelname",
            insertText: 'modelname="${1:model_name}"',
            detail: "Model name for model nodes",
            kind: vscode.CompletionItemKind.Property,
          },
        ].forEach(({ label, insertText, detail, kind }) => {
          suggestions.push(
            createCompletionItem(label, insertText, detail, kind),
          );
          seenKeywords.add(label);
        });
        return suggestions;
      }

      // Top-level context: name, type, label, lang, in, out, node, model, db, mode
      // Only show top-level keywords when the cursor is at/near line start
      const isAtLineStart =
        lineTrimmed.length === 0 || !lineTrimmed.includes(" ");
      if (isAtLineStart) {
        [
          {
            label: `name ${fileName}`,
            insertText: `name ${fileName}`,
            detail: "Suggests filename",
            kind: vscode.CompletionItemKind.Variable,
          },
          {
            label: "type",
            insertText: "type ${1|Default,Report,Model|}",
            detail: "Select a type",
            kind: vscode.CompletionItemKind.Enum,
          },
          {
            label: "lang",
            insertText: "lang=${1|go,python|}",
            detail: "Select a language",
            kind: vscode.CompletionItemKind.Enum,
          },
          {
            label: "db",
            insertText: "db=${1|PG,MSSQL|}",
            detail: "Select a database",
            kind: vscode.CompletionItemKind.Enum,
          },
          {
            label: "mode",
            insertText: "mode=${1|Append,Replace|}",
            detail: "Select a mode",
            kind: vscode.CompletionItemKind.Enum,
          },
          {
            label: "label",
            insertText: 'label "${1:description}"',
            detail: "Process label",
            kind: vscode.CompletionItemKind.Variable,
          },
        ].forEach(({ label, insertText, detail, kind }) => {
          suggestions.push(
            createCompletionItem(label, insertText, detail, kind),
          );
          seenKeywords.add(label.split(" ")[0]!);
        });

        // in and out as basic keyword completions at top level
        for (const kw of ["in", "out"]) {
          suggestions.push(
            new vscode.CompletionItem(kw, vscode.CompletionItemKind.Keyword),
          );
          seenKeywords.add(kw);
        }

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

        const modelItem = new vscode.CompletionItem(
          "model",
          vscode.CompletionItemKind.Keyword,
        );
        modelItem.detail = "Define a MODEL statement";
        modelItem.documentation = new vscode.MarkdownString(
          "Defines a model node with input and output queues.\n\n" +
            "```strm\nmodel nodeName(input1)(output1)\n```",
        );
        modelItem.insertText = new vscode.SnippetString(
          "model ${1:nodeName}(${2:input1})(${3:output1})$4",
        );
        suggestions.push(modelItem);
        seenKeywords.add("model");
      }

      addAntlrTokens();
      return suggestions;
    },
  };
}

export function activate(context: vscode.ExtensionContext) {
  // Register commands dynamically for inserting templates
  registerCommands(context);

  const csvCache = new CsvFileCache(context);

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

  const provider = vscode.languages.registerCompletionItemProvider(
    "strm",
    createCompletionProvider(csvCache),
    " ", // trigger on space so "in " and "out " auto-show snippets
  );

  context.subscriptions.push(provider);

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

  const disposable = vscode.commands.registerCommand(
    "extension.createProcessCommand",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor.");
        return;
      }

      const filePath = path.parse(editor.document.fileName).name;

      // Open a new terminal or reuse an existing one
      const terminal =
        vscode.window.terminals.find((t) => t.name === "VOR Terminal") ||
        vscode.window.createTerminal("VOR Terminal");
      terminal.show();

      // Run "vor create process <filename>"
      terminal.sendText(`vor create process ${filePath}`);
    },
  );

  context.subscriptions.push(disposable);

  const runProcessCommand = vscode.commands.registerCommand(
    "extension.runProcessCommand",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor.");
        return;
      }

      const document = editor.document;
      const position = editor.selection.active;

      // Get the current line text
      const lineText = document.lineAt(position.line).text;

      // Extract the process name after "NAME "
      const match = lineText.match(/\bNAME\s+(\w+)/i);
      if (!match) {
        return;
      }

      const processName = match[1]; // Extracted process name

      // Open a new terminal or reuse an existing one
      const terminal =
        vscode.window.terminals.find((t) => t.name === "VOR Terminal") ||
        vscode.window.createTerminal("VOR Terminal");
      terminal.show();

      // Run "vor run process <processName>"
      terminal.sendText(`vor run ${processName}`);
    },
  );

  context.subscriptions.push(runProcessCommand);
}

export function deactivate() {}

// Function to insert a template into the active editor
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
      if (success) {
        vscode.window.showInformationMessage("Inserted .strm template.");
      } else {
        vscode.window.showErrorMessage("Failed to insert template.");
      }
    });
}

// Function to create a completion item
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

// Function to create INPUT completion items with step-by-step placeholders
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

async function openFirstExisting(possiblePaths: string[]): Promise<void> {
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

function registerCommands(context: vscode.ExtensionContext) {
  Object.entries(templates).forEach(([lang, template]) => {
    const commandId = `extension.insertTemplate${lang}`;
    const command = vscode.commands.registerCommand(commandId, () =>
      insertTemplate(template),
    );
    context.subscriptions.push(command);
  });
}
