import * as assert from "assert";
import * as vscode from "vscode";
import { createCompletionProvider, ICsvFileCache } from "../../extension";

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
  result:
    | vscode.CompletionItem[]
    | vscode.CompletionList
    | null
    | undefined,
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
        (typeof i.label === "string" ? i.label : i.label.label).includes(
          "CSV",
        ),
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
        (typeof i.label === "string" ? i.label : i.label.label).includes(
          "CSV",
        ),
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
        (typeof i.label === "string" ? i.label : i.label.label).includes(
          "CSV",
        ),
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

    test("returns exactly 4 model options", async () => {
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
      assert.strictEqual(
        items.length,
        4,
        `Expected exactly 4 model items, got ${items.length}: ${labels(items)}`,
      );
    });
  });

  suite("top-level context", () => {
    test("empty line returns top-level keywords including name, type, node", async () => {
      const items = await getCompletions("", 0);
      const ls = labels(items);
      assert.ok(
        ls.some((l) => l.startsWith("name")),
        `Expected 'name' in ${ls}`,
      );
      assert.ok(ls.includes("type"), `Expected 'type' in ${ls}`);
      assert.ok(ls.includes("node"), `Expected 'node' in ${ls}`);
      assert.ok(ls.includes("model"), `Expected 'model' in ${ls}`);
      assert.ok(ls.includes("in"), `Expected 'in' in ${ls}`);
      assert.ok(ls.includes("out"), `Expected 'out' in ${ls}`);
    });

    test("top-level does NOT include exceptq=", async () => {
      const items = await getCompletions("", 0);
      const ls = labels(items);
      assert.ok(
        !ls.includes("exceptq"),
        `'exceptq' should NOT appear at top level: ${ls}`,
      );
    });

    test("space trigger on empty line returns no completions", async () => {
      const items = await getCompletions(" ", 1, spaceContext);
      // space-triggered on non-in/out context should be suppressed
      assert.strictEqual(
        items.length,
        0,
        `Expected 0 items on space trigger at non-in/out line, got ${items.length}`,
      );
    });
  });
});
