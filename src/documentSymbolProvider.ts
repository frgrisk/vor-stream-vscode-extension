import * as vscode from "vscode";

export function createDocumentSymbolProvider(): vscode.DocumentSymbolProvider {
  return {
    provideDocumentSymbols(
      document: vscode.TextDocument,
    ): vscode.DocumentSymbol[] {
      const symbols: vscode.DocumentSymbol[] = [];
      // Stack of open subprocess blocks
      const subprocessStack: vscode.DocumentSymbol[] = [];
      let insideBlockComment = false;

      for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        const text = line.text;
        const trimmed = text.trim();

        // Track block comment state
        if (insideBlockComment) {
          if (trimmed.includes("*/")) insideBlockComment = false;
          continue;
        }
        if (trimmed.startsWith("/*")) {
          if (!trimmed.includes("*/")) insideBlockComment = true;
          continue;
        }

        // Skip blank lines and single-line comment lines
        if (!trimmed || trimmed.startsWith("//")) {
          continue;
        }

        const range = new vscode.Range(i, 0, i, text.length);

        // Closing brace: ends the current subprocess block
        if (trimmed === "}" && subprocessStack.length > 0) {
          const entry = subprocessStack[subprocessStack.length - 1];
          entry.range = new vscode.Range(
            entry.range.start,
            new vscode.Position(i, text.length),
          );
          subprocessStack.pop();
          continue;
        }

        // name <identifier>
        const nameMatch = text.match(/^\s*name\s+(\S+)/i);
        if (nameMatch) {
          symbols.push(
            new vscode.DocumentSymbol(
              nameMatch[1],
              "name",
              vscode.SymbolKind.Module,
              range,
              range,
            ),
          );
          continue;
        }

        // subprocess <name>(...)(...)  {
        const subprocMatch = text.match(/^\s*(?:subprocess|process)\s+(\w+)/i);
        if (subprocMatch) {
          const sym = new vscode.DocumentSymbol(
            subprocMatch[1],
            "subprocess",
            vscode.SymbolKind.Namespace,
            range,
            range,
          );
          symbols.push(sym);
          if (text.includes("{")) {
            subprocessStack.push(sym);
          }
          continue;
        }

        // node <name>
        const nodeMatch = text.match(/^\s*node\s+(\w+)/i);
        if (nodeMatch) {
          const sym = new vscode.DocumentSymbol(
            nodeMatch[1],
            "node",
            vscode.SymbolKind.Function,
            range,
            range,
          );
          if (subprocessStack.length > 0) {
            subprocessStack[subprocessStack.length - 1].children.push(sym);
          } else {
            symbols.push(sym);
          }
          continue;
        }

        // model <name>
        const modelMatch = text.match(/^\s*model\s+(\w+)/i);
        if (modelMatch) {
          let endLine = i;
          let j = i + 1;
          while (j < document.lineCount) {
            const nextText = document.lineAt(j).text;
            if (
              /^\s+(exceptq|scenario|unittest|modelname)\s*=/i.test(nextText)
            ) {
              endLine = j;
              j++;
            } else {
              break;
            }
          }
          const sym = new vscode.DocumentSymbol(
            modelMatch[1],
            "model",
            vscode.SymbolKind.Class,
            new vscode.Range(
              i,
              0,
              endLine,
              document.lineAt(endLine).text.length,
            ),
            range, // selectionRange stays on first line
          );
          if (subprocessStack.length > 0) {
            subprocessStack[subprocessStack.length - 1].children.push(sym);
          } else {
            symbols.push(sym);
          }
          i = endLine; // skip already-consumed continuation lines
          continue;
        }

        // in <source> -> <queue>
        const inMatch = text.match(/^\s*in(?:put)?\s+(\S+)\s*->\s*(\S+)/i);
        if (inMatch) {
          symbols.push(
            new vscode.DocumentSymbol(
              `${inMatch[1]} → ${inMatch[2]}`,
              "in",
              vscode.SymbolKind.Event,
              range,
              range,
            ),
          );
          continue;
        }

        // out <queue> -> <dest>
        const outMatch = text.match(/^\s*out(?:put)?\s+(\S+)\s*->\s*(\S+)/i);
        if (outMatch) {
          symbols.push(
            new vscode.DocumentSymbol(
              `${outMatch[1]} → ${outMatch[2]}`,
              "out",
              vscode.SymbolKind.Event,
              range,
              range,
            ),
          );
          continue;
        }

        // sql ... name=<id>
        const sqlMatch = text.match(/^\s*sql\b.*\bname\s*=\s*(\w+)/i);
        if (sqlMatch) {
          symbols.push(
            new vscode.DocumentSymbol(
              sqlMatch[1],
              "sql",
              vscode.SymbolKind.Constant,
              range,
              range,
            ),
          );
          continue;
        }
      }

      return symbols;
    },
  };
}
