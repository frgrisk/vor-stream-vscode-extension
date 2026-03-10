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
    summary:
      "`type` — Process type (top-level) or model type option. " +
      "Top-level values: `Default`, `Report`, `Model`. " +
      'In a model block use `type="Default"` (with `=` and quotes).',
    usage: 'type Default\n// or inside a model block:\ntype="Default"',
  },
  label: {
    summary:
      "`label` — Human-readable label. " +
      'Top-level: `label "text"`. As an option: `label="text"`.',
    usage: 'label "My Process"\n// or as an option:\nlabel="My Process"',
  },
  lang: {
    summary: "`lang` — Implementation language. Values: `go`, `python`.",
    usage: "lang=go\n// or:\nlang=python",
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
  // model has NO node name in the grammar: modelStmt: MODEL nodesInputQueues outputQueues modelOpts*
  model: {
    summary:
      "`model` — Standalone model node. Has no node name; takes inputs and outputs directly.",
    usage:
      'model (inputs)(outputs) [options]\n// e.g.:\nmodel (enriched)(scored) type="Default" modelname="Credit Risk Model"',
  },
  db: {
    summary: "`db` — Database type. Values: `PG`, `MSSQL`, `CSV`, `SAS`.",
    usage: "db=PG\n// or: db=MSSQL",
  },
  mode: {
    summary: "`mode` — Write mode for S3 outputs. Values: `Append`, `Replace`.",
    usage: "mode=Append",
  },
  compress: {
    summary:
      "`compress` — Enable output compression (standalone flag, no `=`).",
    usage: "out queue_name -> destination compress",
  },
  exceptq: {
    summary: "`exceptq` — Exception queue for model nodes.",
    usage: "exceptq=queue_name",
  },
  scenario: {
    summary: "`scenario` — Enable scenario testing. Values: `true`, `false`.",
    usage: "scenario=true",
  },
  unittest: {
    summary: "`unittest` — Enable unit testing. Values: `true`, `false`.",
    usage: "unittest=true",
  },
  modelname: {
    summary: "`modelname` — Display name for model nodes (quoted string).",
    usage: 'modelname="Credit Risk Model"',
  },
  descr: {
    summary:
      '`descr` — Description string. Top-level: `descr "text"`. As an option: `descr="text"`.',
    usage:
      'descr "Process description"\n// or as an option:\ndescr="filter step"',
  },
  subprocess: {
    summary:
      "`subprocess` — Named subprocess block. The `{ }` body is optional.",
    usage: "subprocess mySubProc(inputs)(outputs) {\n  node ...\n}",
  },
  getfact: {
    summary: "`getfact` — Read a named fact into the node.",
    usage: "getfact=rate_table",
  },
  setfact: {
    summary: "`setfact` — Write a named fact from the node.",
    usage: "setfact=computed_rate",
  },
  getsig: {
    summary: "`getsig` — Wait for a named signal before running.",
    usage: "getsig=trigger_signal",
  },
  setsig: {
    summary: "`setsig` — Emit a named signal after running.",
    usage: "setsig=done_signal",
  },
  getdyn: {
    summary: "`getdyn` — Read a dynamic fact.",
    usage: "getdyn=dynFact",
  },
  setdyn: {
    summary: "`setdyn` — Write a dynamic fact.",
    usage: "setdyn=dynFact",
  },
  where: {
    summary: "`where` — Filter condition applied to input rows.",
    usage: 'where="amount > 0"',
  },
  exec_when: {
    summary: "`exec_when` — Execution condition tag list.",
    usage: "exec_when=debug",
  },
  predict: {
    summary: "`predict` — Prediction model name for SQL nodes.",
    usage: "predict=my_model",
  },
  minimize: {
    summary:
      "`minimize` — Optimization target for SQL nodes. Values: `MEMORY`, `TIME`.",
    usage: "minimize=MEMORY\n// or:\nminimize=TIME",
  },
  syntax_version: {
    summary: "`syntax_version` — SQL syntax version number.",
    usage: "syntax_version=1",
  },
  sascmd: {
    summary: "`sascmd` — Path to the SAS executable.",
    usage: 'sascmd="/path/to/sas"',
  },
  sasfile: {
    summary: "`sasfile` — Path to the SAS script file.",
    usage: 'sasfile="model.sas"',
  },
  saswork: {
    summary: "`saswork` — SAS work directory list (comma-separated quoted paths).",
    usage: 'saswork="/tmp/saswork"',
  },
  scenariods: {
    summary: "`scenariods` — Scenario dataset name for SAS nodes.",
    usage: "scenariods=my_dataset",
  },
  framework: {
    summary: "`framework` — SAS framework name.",
    usage: "framework=my_framework",
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
  nodeName: string,
  inputs: string,
  outputs: string,
  kind: "Node" | "Subprocess" = "Node",
): vscode.MarkdownString {
  const md = new vscode.MarkdownString();
  md.appendMarkdown(`${kind}: **${nodeName}**`);
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

function buildModelHover(
  inputs: string,
  outputs: string,
): vscode.MarkdownString {
  const md = new vscode.MarkdownString();
  md.appendMarkdown("Model");
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

      // node has an explicit name: node nodeName(inputs)(outputs)
      const nodeLineMatch = lineText.match(
        /^\s*node\s+(\w+)\s*\(([^)]*)\)\s*\(([^)]*)\)/i,
      );
      if (nodeLineMatch) {
        const nodeName = nodeLineMatch[1]!;
        const inputs = nodeLineMatch[2]!;
        const outputs = nodeLineMatch[3]!;
        if (word === nodeName.toLowerCase()) {
          return new vscode.Hover(
            buildNodeHover(nodeName, inputs, outputs),
            wordRange,
          );
        }
      }

      // subprocess has an explicit name: subprocess name(inputs)(outputs) [{ ... }]
      const subprocessLineMatch = lineText.match(
        /^\s*subprocess\s+(\w+)\s*\(([^)]*)\)\s*\(([^)]*)\)/i,
      );
      if (subprocessLineMatch) {
        const subName = subprocessLineMatch[1]!;
        const inputs = subprocessLineMatch[2]!;
        const outputs = subprocessLineMatch[3]!;
        if (word === subName.toLowerCase()) {
          return new vscode.Hover(
            buildNodeHover(subName, inputs, outputs, "Subprocess"),
            wordRange,
          );
        }
      }

      // model has NO node name in the grammar: model (inputs)(outputs) [opts]
      // Hovering anywhere on a model line (except keyword itself) shows the detail.
      const modelLineMatch = lineText.match(
        /^\s*model\s*\(([^)]*)\)\s*\(([^)]*)\)/i,
      );
      if (modelLineMatch && word !== "model") {
        const inputs = modelLineMatch[1]!;
        const outputs = modelLineMatch[2]!;
        return new vscode.Hover(buildModelHover(inputs, outputs), wordRange);
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
