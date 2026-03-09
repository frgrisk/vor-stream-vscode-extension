import * as assert from "assert";
import * as vscode from "vscode";
import {
  createCompletionProvider,
  ICsvFileCache,
} from "../../providers/completionProvider";

const mockCsvCache: ICsvFileCache = {
  getFiles: async () => ["input.csv", "transactions.csv"],
};

const noopToken = new vscode.CancellationTokenSource().token;
const invokeContext: vscode.CompletionContext = {
  triggerKind: vscode.CompletionTriggerKind.Invoke,
  triggerCharacter: undefined,
};
const spaceContext: vscode.CompletionContext = {
  triggerKind: vscode.CompletionTriggerKind.TriggerCharacter,
  triggerCharacter: " ",
};

function toItems(
  result: vscode.CompletionItem[] | vscode.CompletionList | null | undefined,
): vscode.CompletionItem[] {
  if (!result) return [];
  if (result instanceof vscode.CompletionList) return result.items;
  return result;
}

async function getCompletions(
  content: string,
  character: number,
  context: vscode.CompletionContext = invokeContext,
): Promise<vscode.CompletionItem[]> {
  const doc = await vscode.workspace.openTextDocument({
    content,
    language: "strm",
  });
  const provider = createCompletionProvider(mockCsvCache);
  const position = new vscode.Position(0, character);
  const result = await provider.provideCompletionItems(
    doc,
    position,
    noopToken,
    context,
  );
  return toItems(result);
}

function labels(items: vscode.CompletionItem[]): string[] {
  return items.map((i) =>
    typeof i.label === "string" ? i.label : i.label.label,
  );
}

suite("CompletionProvider", () => {
  suite("in-line context", () => {
    test("returns CSV, DB, S3 snippets after 'in '", async () => {
      const items = await getCompletions("in ", 3);
      const ls = labels(items);
      assert.ok(ls.includes("in (CSV)"), `Expected 'in (CSV)' in ${ls}`);
      assert.ok(ls.includes("in (DB)"), `Expected 'in (DB)' in ${ls}`);
      assert.ok(ls.includes("in (S3)"), `Expected 'in (S3)' in ${ls}`);
    });

    test("returns only 3 items (no extra keywords) after 'in '", async () => {
      const items = await getCompletions("in ", 3);
      assert.strictEqual(
        items.length,
        3,
        `Expected exactly 3 items, got ${items.length}: ${labels(items)}`,
      );
    });

    test("returns CSV, DB, S3 snippets when triggered by space", async () => {
      const items = await getCompletions("in ", 3, spaceContext);
      const ls = labels(items);
      assert.ok(ls.includes("in (CSV)"), `Expected 'in (CSV)' in ${ls}`);
      assert.ok(ls.includes("in (DB)"), `Expected 'in (DB)' in ${ls}`);
      assert.ok(ls.includes("in (S3)"), `Expected 'in (S3)' in ${ls}`);
    });

    test("CSV snippet insertText uses csv files from cache", async () => {
      const items = await getCompletions("in ", 3);
      const csvItem = items.find((i) =>
        (typeof i.label === "string" ? i.label : i.label.label).includes("CSV"),
      );
      assert.ok(csvItem, "Expected CSV item");
      const insertText = csvItem.insertText;
      assert.ok(
        insertText instanceof vscode.SnippetString,
        "insertText should be a SnippetString",
      );
      assert.ok(
        insertText.value.includes("input.csv"),
        `Expected csv file in snippet: ${insertText.value}`,
      );
    });

    test("CSV snippet insertText does NOT start with 'in '", async () => {
      const items = await getCompletions("in ", 3);
      const csvItem = items.find((i) =>
        (typeof i.label === "string" ? i.label : i.label.label).includes("CSV"),
      );
      assert.ok(csvItem, "Expected CSV item");
      const insertText = csvItem.insertText;
      assert.ok(
        insertText instanceof vscode.SnippetString,
        "insertText should be a SnippetString",
      );
      assert.ok(
        !insertText.value.startsWith("in "),
        `Snippet should NOT start with 'in ': ${insertText.value}`,
      );
    });

    test("also matches 'input ' prefix", async () => {
      const items = await getCompletions("input ", 6);
      const ls = labels(items);
      assert.ok(ls.includes("in (CSV)"), `Expected 'in (CSV)' in ${ls}`);
    });
  });

  suite("out-line context", () => {
    test("returns CSV, DB, S3 snippets after 'out '", async () => {
      const items = await getCompletions("out ", 4);
      const ls = labels(items);
      assert.ok(ls.includes("out (CSV)"), `Expected 'out (CSV)' in ${ls}`);
      assert.ok(ls.includes("out (DB)"), `Expected 'out (DB)' in ${ls}`);
      assert.ok(ls.includes("out (S3)"), `Expected 'out (S3)' in ${ls}`);
    });

    test("returns only 3 items (no extra keywords) after 'out '", async () => {
      const items = await getCompletions("out ", 4);
      assert.strictEqual(
        items.length,
        3,
        `Expected exactly 3 items, got ${items.length}: ${labels(items)}`,
      );
    });

    test("returns CSV, DB, S3 snippets when triggered by space", async () => {
      const items = await getCompletions("out ", 4, spaceContext);
      const ls = labels(items);
      assert.ok(ls.includes("out (CSV)"), `Expected 'out (CSV)' in ${ls}`);
    });

    test("CSV snippet insertText does NOT start with 'out '", async () => {
      const items = await getCompletions("out ", 4);
      const csvItem = items.find((i) =>
        (typeof i.label === "string" ? i.label : i.label.label).includes("CSV"),
      );
      assert.ok(csvItem, "Expected CSV item");
      const insertText = csvItem.insertText;
      assert.ok(insertText instanceof vscode.SnippetString);
      assert.ok(
        !insertText.value.startsWith("out "),
        `Snippet should NOT start with 'out ': ${insertText.value}`,
      );
    });
  });

  suite("model continuation context", () => {
    test("returns model options on an indented line below model", async () => {
      const content = "model mymodel(a)(b)\n  ";
      const doc = await vscode.workspace.openTextDocument({
        content,
        language: "strm",
      });
      const provider = createCompletionProvider(mockCsvCache);
      const position = new vscode.Position(1, 2); // indented line
      const items = toItems(
        await provider.provideCompletionItems(
          doc,
          position,
          noopToken,
          invokeContext,
        ),
      );
      const ls = labels(items);
      assert.ok(ls.includes("exceptq"), `Expected 'exceptq' in ${ls}`);
      assert.ok(ls.includes("scenario"), `Expected 'scenario' in ${ls}`);
      assert.ok(ls.includes("unittest"), `Expected 'unittest' in ${ls}`);
      assert.ok(ls.includes("modelname"), `Expected 'modelname' in ${ls}`);
    });

    test("model continuation does NOT include unrelated keywords", async () => {
      const content = "model mymodel(a)(b)\n  ";
      const doc = await vscode.workspace.openTextDocument({
        content,
        language: "strm",
      });
      const provider = createCompletionProvider(mockCsvCache);
      const position = new vscode.Position(1, 2);
      const items = toItems(
        await provider.provideCompletionItems(
          doc,
          position,
          noopToken,
          invokeContext,
        ),
      );
      const ls = labels(items);
      assert.ok(
        !ls.includes("node"),
        `'node' should NOT appear in model context: ${ls}`,
      );
      assert.ok(
        !ls.includes("in"),
        `'in' should NOT appear in model context: ${ls}`,
      );
    });

    test("returns 6 model options (type,label,exceptq,scenario,unittest,modelname) when none defined", async () => {
      const content = "model mymodel(a)(b)\n  ";
      const doc = await vscode.workspace.openTextDocument({
        content,
        language: "strm",
      });
      const provider = createCompletionProvider(mockCsvCache);
      const position = new vscode.Position(1, 2);
      const items = toItems(
        await provider.provideCompletionItems(
          doc,
          position,
          noopToken,
          invokeContext,
        ),
      );
      const ls = labels(items);
      assert.ok(ls.includes("type"), `Expected 'type' in ${ls}`);
      assert.ok(ls.includes("label"), `Expected 'label' in ${ls}`);
      assert.ok(ls.includes("exceptq"), `Expected 'exceptq' in ${ls}`);
      assert.strictEqual(
        items.length,
        6,
        `Expected exactly 6 model items, got ${items.length}: ${ls}`,
      );
    });

    test("excludes options defined on previous continuation lines", async () => {
      const content = "model mymodel(a)(b)\n  exceptq=errq\n  ";
      const doc = await vscode.workspace.openTextDocument({
        content,
        language: "strm",
      });
      const provider = createCompletionProvider(mockCsvCache);
      const position = new vscode.Position(2, 2);
      const items = toItems(
        await provider.provideCompletionItems(
          doc,
          position,
          noopToken,
          invokeContext,
        ),
      );
      const ls = labels(items);
      assert.ok(
        !ls.includes("exceptq"),
        `'exceptq' should be excluded since it is already defined: ${ls}`,
      );
      assert.ok(
        ls.includes("scenario"),
        `Expected 'scenario' still present: ${ls}`,
      );
      assert.strictEqual(
        items.length,
        5,
        `Expected 5 remaining options, got ${items.length}: ${ls}`,
      );
    });

    test("excludes options already typed on the model line itself", async () => {
      const content =
        'model mymodel(a)(b) type="Default" exceptq=errq scenario=true unittest=false modelname="M" label="L" ';
      const doc = await vscode.workspace.openTextDocument({
        content,
        language: "strm",
      });
      const provider = createCompletionProvider(mockCsvCache);
      const position = new vscode.Position(0, content.length);
      const items = toItems(
        await provider.provideCompletionItems(
          doc,
          position,
          noopToken,
          invokeContext,
        ),
      );
      assert.strictEqual(
        items.length,
        0,
        `Expected 0 items when all defined on same line, got ${items.length}: ${labels(items)}`,
      );
    });

    test("in-line CSV source: shows where= and name= but NOT db=", async () => {
      const line = "in input.csv -> raw_input ";
      const items = await getCompletions(line, line.length);
      const ls = labels(items);
      assert.ok(!ls.includes("in (CSV)"), `Snippets must not appear: ${ls}`);
      assert.ok(
        !ls.includes("db"),
        `'db' must not appear for CSV source: ${ls}`,
      );
      assert.ok(ls.includes("where"), `Expected 'where' for CSV: ${ls}`);
      assert.ok(ls.includes("name"), `Expected 'name' for CSV: ${ls}`);
    });

    test("in-line DB source (schema.table): shows db=, where=, name=", async () => {
      const line = "in public.transactions -> raw_input ";
      const items = await getCompletions(line, line.length);
      const ls = labels(items);
      assert.ok(ls.includes("db"), `Expected 'db' for DB source: ${ls}`);
      assert.ok(ls.includes("where"), `Expected 'where' for DB source: ${ls}`);
    });

    test("in-line S3 source: no options", async () => {
      const line = "in s3://bucket/path -> raw_input ";
      const items = await getCompletions(line, line.length);
      assert.strictEqual(
        items.length,
        0,
        `Expected no options for S3 source, got ${items.length}: ${labels(items)}`,
      );
    });

    test("out-line CSV dest: shows compress,exec_when but NOT db= or mode=", async () => {
      const line = "out results -> output.csv ";
      const items = await getCompletions(line, line.length);
      const ls = labels(items);
      assert.ok(!ls.includes("out (CSV)"), `Snippets must not appear: ${ls}`);
      assert.ok(!ls.includes("db"), `'db' must not appear for CSV dest: ${ls}`);
      assert.ok(
        !ls.includes("mode"),
        `'mode' must not appear for CSV dest: ${ls}`,
      );
      assert.ok(
        ls.includes("compress"),
        `Expected 'compress' for CSV dest: ${ls}`,
      );
      assert.ok(
        ls.includes("exec_when"),
        `Expected 'exec_when' for CSV dest: ${ls}`,
      );
    });

    test("out-line S3 dest: shows mode=, compress, exec_when= but NOT db=", async () => {
      const line = "out results -> s3://bucket/path ";
      const items = await getCompletions(line, line.length);
      const ls = labels(items);
      assert.ok(ls.includes("mode"), `Expected 'mode' for S3 dest: ${ls}`);
      assert.ok(
        ls.includes("compress"),
        `Expected 'compress' for S3 dest: ${ls}`,
      );
      assert.ok(!ls.includes("db"), `'db' must not appear for S3 dest: ${ls}`);
    });

    test("out-line DB dest: shows db=, compress, exec_when= but NOT mode=", async () => {
      const line = "out results -> analytics.results ";
      const items = await getCompletions(line, line.length);
      const ls = labels(items);
      assert.ok(ls.includes("db"), `Expected 'db' for DB dest: ${ls}`);
      assert.ok(
        !ls.includes("mode"),
        `'mode' must not appear for DB dest: ${ls}`,
      );
    });

    test("out-line with -> excludes already-used flags", async () => {
      const line = "out results -> output.csv compress ";
      const items = await getCompletions(line, line.length);
      const ls = labels(items);
      assert.ok(
        !ls.includes("compress"),
        `'compress' should be excluded since already present: ${ls}`,
      );
    });
  });

  suite("node-line option context", () => {
    test("node after parens suggests lang= and other options", async () => {
      const line = "node filternode(a)(b) ";
      const items = await getCompletions(line, line.length);
      const ls = labels(items);
      assert.ok(ls.includes("lang"), `Expected 'lang' for node line: ${ls}`);
      assert.ok(
        ls.includes("exec_when"),
        `Expected 'exec_when' for node line: ${ls}`,
      );
      assert.ok(
        ls.includes("getfact"),
        `Expected 'getfact' for node line: ${ls}`,
      );
      assert.ok(
        ls.includes("setsig"),
        `Expected 'setsig' for node line: ${ls}`,
      );
    });

    test("node-line excludes already-used options", async () => {
      const line = "node filternode(a)(b) lang=go ";
      const items = await getCompletions(line, line.length);
      const ls = labels(items);
      assert.ok(
        !ls.includes("lang"),
        `'lang' should be excluded since already present: ${ls}`,
      );
      assert.ok(
        ls.includes("exec_when"),
        `Expected 'exec_when' still present: ${ls}`,
      );
    });
  });

  suite("top-level context", () => {
    test("empty line returns core top-level keywords", async () => {
      const items = await getCompletions("", 0);
      const ls = labels(items);
      assert.ok(
        ls.some((l) => l.startsWith("name")),
        `Expected 'name' in ${ls}`,
      );
      assert.ok(ls.includes("type"), `Expected 'type' in ${ls}`);
      assert.ok(ls.includes("label"), `Expected 'label' in ${ls}`);
      assert.ok(ls.includes("descr"), `Expected 'descr' in ${ls}`);
      assert.ok(ls.includes("node"), `Expected 'node' in ${ls}`);
      assert.ok(ls.includes("model"), `Expected 'model' in ${ls}`);
      assert.ok(ls.includes("subprocess"), `Expected 'subprocess' in ${ls}`);
      assert.ok(ls.includes("in"), `Expected 'in' in ${ls}`);
      assert.ok(ls.includes("out"), `Expected 'out' in ${ls}`);
    });

    test("top-level does NOT include line-option keywords", async () => {
      const items = await getCompletions("", 0);
      const ls = labels(items);
      assert.ok(
        !ls.includes("exceptq"),
        `'exceptq' must not appear at top level: ${ls}`,
      );
      assert.ok(
        !ls.includes("lang"),
        `'lang' must not appear at top level: ${ls}`,
      );
      assert.ok(!ls.includes("db"), `'db' must not appear at top level: ${ls}`);
      assert.ok(
        !ls.includes("mode"),
        `'mode' must not appear at top level: ${ls}`,
      );
    });

    test("model snippet has no node name (grammar: model (inputs)(outputs))", async () => {
      const items = await getCompletions("", 0);
      const modelItem = items.find(
        (i) =>
          (typeof i.label === "string" ? i.label : i.label.label) === "model",
      );
      assert.ok(modelItem, "Expected 'model' item");
      const insertText = modelItem.insertText;
      assert.ok(insertText instanceof vscode.SnippetString);
      assert.ok(
        !insertText.value.includes("nodeName"),
        `Model snippet must not include a node name: ${insertText.value}`,
      );
      assert.ok(
        insertText.value.startsWith("model ("),
        `Model snippet should start with 'model (': ${insertText.value}`,
      );
    });

    test("space trigger on empty line returns no completions", async () => {
      const items = await getCompletions(" ", 1, spaceContext);
      assert.strictEqual(
        items.length,
        0,
        `Expected 0 items on space trigger at non-in/out line, got ${items.length}`,
      );
    });
  });
});
