import * as vscode from "vscode";
import * as path from "path";

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

      const fileName = path.parse(document.fileName).name;

      // Determine context from the line text up to the cursor
      const linePrefix = document
        .lineAt(position)
        .text.slice(0, position.character);
      const lineTrimmed = linePrefix.trimStart();

      // Helper: check if an option keyword already appears in a given text
      const hasOpt = (opt: string, text: string) =>
        new RegExp(`\\b${opt}\\b`, "i").test(text);

      // ── in-line: snippet variants (nothing typed after keyword yet) ──────────
      if (/^in(?:put)?\s+$/i.test(lineTrimmed)) {
        const csvFiles = await csvCache.getFiles([
          path.join(path.dirname(document.fileName), "input"),
          path.join(path.dirname(path.dirname(document.fileName)), "input"),
        ]);
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
        });
        return suggestions;
      }

      // ── in-line: options after source -> queue ───────────────────────────────
      // Only show when something meaningful is written after ->
      if (/^in(?:put)?\s+\S+\s*->\s*\S/i.test(lineTrimmed)) {
        const srcMatch = lineTrimmed.match(/^in(?:put)?\s+(\S+)/i);
        const src = (srcMatch?.[1] ?? "").toLowerCase();
        // Scope options by source type:
        //   S3 source      → no options (remote, read-only)
        //   CSV source     → where=, name=  (no db=, compress is out-only)
        //   DB/other       → db=, where=, name=
        const inOpts = src.startsWith("s3://")
          ? []
          : src.endsWith(".csv")
            ? [
                {
                  label: "where",
                  insertText: 'where="${1:condition}"',
                  detail: "Filter rows by condition",
                  kind: vscode.CompletionItemKind.Property,
                },
                {
                  label: "name",
                  insertText: "name=${1:queue_alias}",
                  detail: "Queue alias name",
                  kind: vscode.CompletionItemKind.Property,
                },
              ]
            : [
                {
                  label: "db",
                  insertText: "db=${1|PG,MSSQL|}",
                  detail: "Database type",
                  kind: vscode.CompletionItemKind.Enum,
                },
                {
                  label: "where",
                  insertText: 'where="${1:condition}"',
                  detail: "Filter rows by condition",
                  kind: vscode.CompletionItemKind.Property,
                },
                {
                  label: "name",
                  insertText: "name=${1:queue_alias}",
                  detail: "Queue alias name",
                  kind: vscode.CompletionItemKind.Property,
                },
              ];
        inOpts
          .filter(({ label }) => !hasOpt(label, lineTrimmed))
          .forEach(({ label, insertText, detail, kind }) => {
            suggestions.push(
              createCompletionItem(label, insertText, detail, kind),
            );
          });
        return suggestions;
      }

      // ── out-line: snippet variants (nothing typed after keyword yet) ─────────
      if (/^out(?:put)?\s+$/i.test(lineTrimmed)) {
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
        });
        return suggestions;
      }

      // ── out-line: options after queue -> dest ────────────────────────────────
      if (/^out(?:put)?\s+\S+\s*->\s*\S/i.test(lineTrimmed)) {
        const dstMatch = lineTrimmed.match(/->\s*(\S+)/i);
        const dst = (dstMatch?.[1] ?? "").toLowerCase();
        // Scope options by destination type:
        //   S3 dest    → mode=, compress, exec_when=  (no db=)
        //   CSV dest   → compress, exec_when=  (no db=, no mode=)
        //   DB/other   → db=, compress, exec_when=  (no mode=)
        const outOpts = dst.startsWith("s3://")
          ? [
              {
                label: "mode",
                insertText: "mode=${1|Append,Replace|}",
                detail: "Write mode",
                kind: vscode.CompletionItemKind.Enum,
              },
              {
                label: "compress",
                insertText: "compress",
                detail: "Enable compression",
                kind: vscode.CompletionItemKind.Keyword,
              },
              {
                label: "exec_when",
                insertText: "exec_when=${1:tag}",
                detail: "Execution condition tag",
                kind: vscode.CompletionItemKind.Property,
              },
            ]
          : dst.endsWith(".csv")
            ? [
                {
                  label: "compress",
                  insertText: "compress",
                  detail: "Enable compression",
                  kind: vscode.CompletionItemKind.Keyword,
                },
                {
                  label: "exec_when",
                  insertText: "exec_when=${1:tag}",
                  detail: "Execution condition tag",
                  kind: vscode.CompletionItemKind.Property,
                },
              ]
            : [
                {
                  label: "db",
                  insertText: "db=${1|PG,MSSQL|}",
                  detail: "Database type",
                  kind: vscode.CompletionItemKind.Enum,
                },
                {
                  label: "compress",
                  insertText: "compress",
                  detail: "Enable compression",
                  kind: vscode.CompletionItemKind.Keyword,
                },
                {
                  label: "exec_when",
                  insertText: "exec_when=${1:tag}",
                  detail: "Execution condition tag",
                  kind: vscode.CompletionItemKind.Property,
                },
              ];
        outOpts
          .filter(({ label }) => !hasOpt(label, lineTrimmed))
          .forEach(({ label, insertText, detail, kind }) => {
            suggestions.push(
              createCompletionItem(label, insertText, detail, kind),
            );
          });
        return suggestions;
      }

      // ── node-after-parens: node-level options ────────────────────────────────
      if (/^node\s+\w+\([^)]*\)\([^)]*\)/i.test(lineTrimmed)) {
        [
          {
            label: "lang",
            insertText: "lang=${1|go,python|}",
            detail: "Implementation language",
            kind: vscode.CompletionItemKind.Enum,
          },
          {
            label: "exec_when",
            insertText: "exec_when=${1:tag}",
            detail: "Execution condition tag",
            kind: vscode.CompletionItemKind.Property,
          },
          {
            label: "where",
            insertText: 'where="${1:condition}"',
            detail: "Filter condition",
            kind: vscode.CompletionItemKind.Property,
          },
          {
            label: "getfact",
            insertText: "getfact=${1:fact_name}",
            detail: "Read a named fact",
            kind: vscode.CompletionItemKind.Property,
          },
          {
            label: "setfact",
            insertText: "setfact=${1:fact_name}",
            detail: "Write a named fact",
            kind: vscode.CompletionItemKind.Property,
          },
          {
            label: "getsig",
            insertText: "getsig=${1:signal_name}",
            detail: "Wait for a named signal",
            kind: vscode.CompletionItemKind.Property,
          },
          {
            label: "setsig",
            insertText: "setsig=${1:signal_name}",
            detail: "Emit a named signal",
            kind: vscode.CompletionItemKind.Property,
          },
          {
            label: "get_dyn",
            insertText: "get_dyn=${1:dyn_fact}",
            detail: "Read a dynamic fact",
            kind: vscode.CompletionItemKind.Property,
          },
          {
            label: "set_dyn",
            insertText: "set_dyn=${1:dyn_fact}",
            detail: "Write a dynamic fact",
            kind: vscode.CompletionItemKind.Property,
          },
          {
            label: "getdyn",
            insertText: "getdyn=${1:dyn_fact}",
            detail: "Read a dynamic fact (legacy)",
            kind: vscode.CompletionItemKind.Property,
          },
          {
            label: "setdyn",
            insertText: "setdyn=${1:dyn_fact}",
            detail: "Write a dynamic fact (legacy)",
            kind: vscode.CompletionItemKind.Property,
          },
        ]
          .filter(({ label }) => !hasOpt(label, lineTrimmed))
          .forEach(({ label, insertText, detail, kind }) => {
            suggestions.push(
              createCompletionItem(label, insertText, detail, kind),
            );
          });
        return suggestions;
      }

      // ── sql-after-semicolon: options that follow the SQL body ────────────────
      // Grammar: sqlStmt: SQL everythingSemi nameDescrPredict
      // Options (nameDescrPredict): name, descr, label, predict, setFact, getFact, minimize, syntaxVersion
      if (/^sql\s+/i.test(lineTrimmed) && lineTrimmed.includes(";")) {
        const afterSemi = lineTrimmed.slice(lineTrimmed.lastIndexOf(";") + 1);
        [
          {
            label: "predict",
            insertText: "predict=${1:model_name}",
            detail: "Prediction model name",
            kind: vscode.CompletionItemKind.Property,
          },
          {
            label: "minimize",
            insertText: "minimize=${1|MEMORY,TIME|}",
            detail: "Optimization target (MEMORY or TIME)",
            kind: vscode.CompletionItemKind.Enum,
          },
          {
            label: "syntax_version",
            insertText: "syntax_version=${1:1}",
            detail: "SQL syntax version number",
            kind: vscode.CompletionItemKind.Property,
          },
          {
            label: "name",
            insertText: "name=${1:query_name}",
            detail: "Query name",
            kind: vscode.CompletionItemKind.Property,
          },
          {
            label: "descr",
            insertText: 'descr="${1:description}"',
            detail: "Query description",
            kind: vscode.CompletionItemKind.Property,
          },
        ]
          .filter(({ label }) => !hasOpt(label, afterSemi))
          .forEach(({ label, insertText, detail, kind }) => {
            suggestions.push(
              createCompletionItem(label, insertText, detail, kind),
            );
          });
        return suggestions;
      }

      // ── model continuation: indented line below a model statement ────────────
      // Must be checked BEFORE the space-suppress guard so space trigger works.
      const isModelLine = /^model\s/i.test(lineTrimmed);
      const isIndented = linePrefix.length > lineTrimmed.length;
      let isModelContinuation = isModelLine;
      let modelStartLine = isModelLine ? position.line : -1;
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
            modelStartLine = i;
            break;
          }
          if (prevTrimmed !== "" && prevLine.length === prevTrimmed.length) {
            break;
          }
        }
      }

      if (isModelContinuation) {
        // Scan model start through current cursor position for already-defined opts
        const definedModelOpts = new Set<string>();
        const modelOpts = [
          "type",
          "label",
          "exception_queue",
          "exceptq",
          "scenario",
          "unit_test",
          "unittest",
          "model_name",
          "modelname",
        ];
        const legacyToNew: Record<string, string> = {
          exceptq: "exception_queue",
          unittest: "unit_test",
          modelname: "model_name",
        };
        if (modelStartLine >= 0) {
          for (let i = modelStartLine; i <= position.line; i++) {
            // For the current line use only what's before the cursor
            const lineText =
              i === position.line ? linePrefix : document.lineAt(i).text;
            for (const opt of modelOpts) {
              if (new RegExp(`\\b${opt}\\b`, "i").test(lineText)) {
                definedModelOpts.add(opt);
                // Also mark the canonical new form so legacy usage suppresses new-form completions
                const canonical = legacyToNew[opt];
                if (canonical) definedModelOpts.add(canonical);
              }
            }
          }
        }
        [
          {
            label: "type",
            insertText: 'type="${1|Default,Report,Model|}"',
            detail: "Model type",
            kind: vscode.CompletionItemKind.Enum,
          },
          {
            label: "label",
            insertText: 'label="${1:description}"',
            detail: "Human-readable label",
            kind: vscode.CompletionItemKind.Property,
          },
          {
            label: "exception_queue",
            insertText: "exception_queue=${1:queue_name}",
            detail: "Exception queue",
            kind: vscode.CompletionItemKind.Property,
          },
          {
            label: "scenario",
            insertText: "scenario=${1|true,false|}",
            detail: "Enable scenario testing",
            kind: vscode.CompletionItemKind.Enum,
          },
          {
            label: "unit_test",
            insertText: "unit_test=${1|true,false|}",
            detail: "Enable unit testing",
            kind: vscode.CompletionItemKind.Enum,
          },
          {
            label: "model_name",
            insertText: 'model_name="${1:model_name}"',
            detail: "Display name for model",
            kind: vscode.CompletionItemKind.Property,
          },
        ]
          .filter(({ label }) => !definedModelOpts.has(label))
          .forEach(({ label, insertText, detail, kind }) => {
            suggestions.push(
              createCompletionItem(label, insertText, detail, kind),
            );
          });
        return suggestions;
      }

      // ── sas continuation: indented line below a sas statement ────────────────
      // Grammar: sasOpts: name | descr | label | sascmd | sasFile | getFact | getSig | workDir | scenariods | framework
      const isSasLine = /^sas\s/i.test(lineTrimmed);
      let isSasContinuation = isSasLine;
      let sasStartLine = isSasLine ? position.line : -1;
      if (!isSasContinuation && isIndented) {
        for (
          let i = position.line - 1;
          i >= Math.max(0, position.line - 10);
          i--
        ) {
          const prevLine = document.lineAt(i).text;
          const prevTrimmed = prevLine.trim();
          if (/^sas\s/i.test(prevTrimmed)) {
            isSasContinuation = true;
            sasStartLine = i;
            break;
          }
          if (prevTrimmed !== "" && prevLine.length === prevTrimmed.length) {
            break;
          }
        }
      }

      if (isSasContinuation) {
        const definedSasOpts = new Set<string>();
        const sasOptsList = [
          "sascmd",
          "sasfile",
          "saswork",
          "scenariods",
          "framework",
          "name",
          "descr",
          "label",
        ];
        if (sasStartLine >= 0) {
          for (let i = sasStartLine; i <= position.line; i++) {
            const lineText =
              i === position.line ? linePrefix : document.lineAt(i).text;
            for (const opt of sasOptsList) {
              if (new RegExp(`\\b${opt}\\b`, "i").test(lineText)) {
                definedSasOpts.add(opt);
              }
            }
          }
        }
        [
          {
            label: "sascmd",
            insertText: 'sascmd="${1:/path/to/sas}"',
            detail: "SAS executable path",
            kind: vscode.CompletionItemKind.Property,
          },
          {
            label: "sasfile",
            insertText: 'sasfile="${1:file.sas}"',
            detail: "SAS script file path",
            kind: vscode.CompletionItemKind.Property,
          },
          {
            label: "saswork",
            insertText: 'saswork="${1:/work/dir}"',
            detail: "SAS work directory list",
            kind: vscode.CompletionItemKind.Property,
          },
          {
            label: "scenariods",
            insertText: "scenariods=${1:dataset_name}",
            detail: "Scenario dataset name",
            kind: vscode.CompletionItemKind.Property,
          },
          {
            label: "framework",
            insertText: "framework=${1:framework_name}",
            detail: "SAS framework name",
            kind: vscode.CompletionItemKind.Property,
          },
        ]
          .filter(({ label }) => !definedSasOpts.has(label))
          .forEach(({ label, insertText, detail, kind }) => {
            suggestions.push(
              createCompletionItem(label, insertText, detail, kind),
            );
          });
        return suggestions;
      }

      // ── space-suppress guard ─────────────────────────────────────────────────
      // Only reached when none of the specific contexts above matched.
      // Suppress noisy completions on every other space keystroke.
      if (
        context.triggerKind === vscode.CompletionTriggerKind.TriggerCharacter &&
        context.triggerCharacter === " "
      ) {
        return suggestions;
      }

      // ── top-level context: predefined keyword list only ───────────────────────
      // No ANTLR token dump — only show the grammar's top-level statements.
      const isAtLineStart =
        lineTrimmed.length === 0 || !lineTrimmed.includes(" ");
      if (isAtLineStart) {
        [
          {
            label: `name ${fileName}`,
            insertText: `name ${fileName}`,
            detail: "Process name (filename suggestion)",
            kind: vscode.CompletionItemKind.Variable,
          },
          {
            label: "type",
            insertText: "type ${1|Default,Report,Model|}",
            detail: "Process type",
            kind: vscode.CompletionItemKind.Enum,
          },
          {
            label: "label",
            insertText: 'label "${1:description}"',
            detail: "Human-readable label",
            kind: vscode.CompletionItemKind.Variable,
          },
          {
            label: "descr",
            insertText: 'descr "${1:description}"',
            detail: "Process description",
            kind: vscode.CompletionItemKind.Variable,
          },
        ].forEach(({ label, insertText, detail, kind }) => {
          suggestions.push(
            createCompletionItem(label, insertText, detail, kind),
          );
        });

        for (const kw of ["in", "out"]) {
          suggestions.push(
            new vscode.CompletionItem(kw, vscode.CompletionItemKind.Keyword),
          );
        }

        const nodeItem = new vscode.CompletionItem(
          "node",
          vscode.CompletionItemKind.Keyword,
        );
        nodeItem.detail = "Processing node";
        nodeItem.documentation = new vscode.MarkdownString(
          "Defines a processing node with input and output queues.\n\n" +
            "```strm\nnode nodeName(input1)(output1)\n```",
        );
        nodeItem.insertText = new vscode.SnippetString(
          "node ${1:nodeName}(${2:input1})(${3:output1})$4",
        );
        suggestions.push(nodeItem);

        const modelItem = new vscode.CompletionItem(
          "model",
          vscode.CompletionItemKind.Keyword,
        );
        modelItem.detail = "Standalone model node (no node name)";
        modelItem.documentation = new vscode.MarkdownString(
          "Defines a model node. Note: no node name in the grammar.\n\n" +
            "```strm\nmodel (input1)(output1)\n```",
        );
        // Grammar: model has NO node name — model (inputs)(outputs) [opts]
        modelItem.insertText = new vscode.SnippetString(
          "model (${1:input1})(${2:output1})$3",
        );
        suggestions.push(modelItem);

        const subprocItem = new vscode.CompletionItem(
          "subprocess",
          vscode.CompletionItemKind.Keyword,
        );
        subprocItem.detail = "Named subprocess block";
        subprocItem.insertText = new vscode.SnippetString(
          "subprocess ${1:name}(${2:inputs})(${3:outputs}) {\n\t$4\n}",
        );
        suggestions.push(subprocItem);
      }

      return suggestions;
    },
  };
}

export function registerCompletionProvider(
  context: vscode.ExtensionContext,
  csvCache: ICsvFileCache,
): void {
  const provider = vscode.languages.registerCompletionItemProvider(
    "strm",
    createCompletionProvider(csvCache),
    " ", // trigger on space so "in " and "out " auto-show snippets
  );
  context.subscriptions.push(provider);
}
