import * as vscode from "vscode";

interface KeywordDoc {
  summary: string;
  usage: string;
}

const KEYWORD_DOCS: Record<string, KeywordDoc> = {
  name: {
    summary: "`name` — Process name identifier.",
    usage: "name myprocess",
  },
  type: {
    summary: "`type` — Process type. Values: `Default`, `Report`, `Model`.",
    usage: "type Default",
  },
  label: {
    summary: "`label` — Human-readable label string.",
    usage: 'label "My Process"',
  },
  lang: {
    summary: "`lang` — Implementation language.",
    usage: "lang=go",
  },
  in: {
    summary: "`in` — Input declaration.",
    usage: "in source.csv -> queue_name",
  },
  out: {
    summary: "`out` — Output declaration.",
    usage: "out queue_name -> destination",
  },
  node: {
    summary: "`node` — Processing node definition.",
    usage: "node nodeName(inputs)(outputs) [options]",
  },
  model: {
    summary: "`model` — Standalone model node.",
    usage: "model nodeName(inputs)(outputs) [options]",
  },
  db: {
    summary: "`db` — Database type. Values: `PG`, `MSSQL`.",
    usage: "db=PG",
  },
  mode: {
    summary: "`mode` — Processing mode. Values: `Append`, `Replace`.",
    usage: "mode=Append",
  },
  exceptq: {
    summary: "`exceptq` — Exception queue for model nodes.",
    usage: "exceptq=queue_name",
  },
  scenario: {
    summary: "`scenario` — Enable scenario testing.",
    usage: "scenario=true",
  },
  unittest: {
    summary: "`unittest` — Enable unit testing.",
    usage: "unittest=true",
  },
  modelname: {
    summary: "`modelname` — Model name string for model nodes.",
    usage: 'modelname="MyModel"',
  },
  subprocess: {
    summary: "`subprocess` — Named subprocess block.",
    usage: "subprocess mySubProc(inputs)(outputs) {\n  node ...\n}",
  },
};

function buildKeywordHover(doc: KeywordDoc): vscode.MarkdownString {
  const md = new vscode.MarkdownString();
  md.appendMarkdown(doc.summary);
  md.appendText("\n\n");
  md.appendMarkdown("**Usage:**");
  md.appendText("\n");
  md.appendCodeblock(doc.usage, "strm");
  return md;
}

function buildNodeHover(
  keyword: "node" | "model",
  nodeName: string,
  inputs: string,
  outputs: string,
): vscode.MarkdownString {
  const md = new vscode.MarkdownString();
  const label = keyword === "node" ? "Node" : "Model";
  md.appendMarkdown(`${label}: **${nodeName}**`);
  if (inputs) {
    md.appendText("\n");
    md.appendMarkdown(`Inputs: \`${inputs}\``);
  }
  if (outputs) {
    md.appendText("\n");
    md.appendMarkdown(`Outputs: \`${outputs}\``);
  }
  return md;
}

export function createHoverProvider(): vscode.HoverProvider {
  return {
    provideHover(
      document: vscode.TextDocument,
      position: vscode.Position,
      _token: vscode.CancellationToken,
    ): vscode.Hover | undefined {
      const lineText = document.lineAt(position.line).text;
      if (/^\s*\/\//.test(lineText)) {
        return undefined;
      }
      const wordRange = document.getWordRangeAtPosition(position);
      if (!wordRange) {
        return undefined;
      }
      const word = document.getText(wordRange).toLowerCase();

      // Check if we're hovering on a node/model identifier (not the keyword itself)
      const nodeLineMatch = lineText.match(
        /^\s*(node|model)\s+(\w+)\s*\(([^)]*)\)\s*\(([^)]*)\)/i,
      );
      if (nodeLineMatch) {
        const keyword = nodeLineMatch[1].toLowerCase() as "node" | "model";
        const nodeName = nodeLineMatch[2];
        const inputs = nodeLineMatch[3];
        const outputs = nodeLineMatch[4];

        if (word === nodeName.toLowerCase()) {
          return new vscode.Hover(
            buildNodeHover(keyword, nodeName, inputs, outputs),
            wordRange,
          );
        }
      }

      const normalized =
        (
          { input: "in", output: "out", process: "subprocess" } as Record<
            string,
            string
          >
        )[word] ?? word;
      const keywordDoc = KEYWORD_DOCS[normalized];
      if (keywordDoc) {
        return new vscode.Hover(buildKeywordHover(keywordDoc), wordRange);
      }

      return undefined;
    },
  };
}
