import * as assert from "assert";
import * as vscode from "vscode";
import { createHoverProvider } from "../../hoverProvider";

async function getHover(
  content: string,
  line: number,
  character: number,
): Promise<vscode.Hover | undefined> {
  const doc = await vscode.workspace.openTextDocument({
    content,
    language: "strm",
  });
  const provider = createHoverProvider();
  const cts = new vscode.CancellationTokenSource();
  try {
    const result = await provider.provideHover(
      doc,
      new vscode.Position(line, character),
      cts.token,
    );
    return result ?? undefined;
  } finally {
    cts.dispose();
  }
}

suite("HoverProvider", () => {
  test("createHoverProvider returns object with provideHover method", () => {
    const provider = createHoverProvider();
    assert.ok(
      typeof provider.provideHover === "function",
      "Expected provideHover to be a function",
    );
  });

  test("hovering on 'name' keyword returns Hover with markdown content", async () => {
    const hover = await getHover("name myprocess\n", 0, 1);
    assert.ok(hover, "Expected a hover result for 'name'");
    assert.ok(
      hover.contents.length > 0,
      "Expected hover to have non-empty contents",
    );
  });

  test("hovering on 'node' keyword returns Hover with markdown content", async () => {
    const hover = await getHover("node filternode(a)(b)\n", 0, 1);
    assert.ok(hover, "Expected a hover result for 'node'");
    assert.ok(hover.contents.length > 0, "Expected hover to have contents");
  });

  test("hovering on 'model' keyword returns Hover with markdown content", async () => {
    // Real grammar: model has no node name — model (inputs)(outputs)
    const hover = await getHover(
      'model (enriched)(scored) type="Default"\n',
      0,
      1,
    );
    assert.ok(hover, "Expected a hover result for 'model'");
    assert.ok(hover.contents.length > 0, "Expected hover to have contents");
  });

  test("hovering on 'type' keyword returns Hover with markdown content", async () => {
    const hover = await getHover("type Default\n", 0, 1);
    assert.ok(hover, "Expected a hover result for 'type'");
    assert.ok(hover.contents.length > 0, "Expected hover to have contents");
  });

  test("hovering on 'in' keyword returns Hover with markdown content", async () => {
    const hover = await getHover("in input.csv -> raw\n", 0, 1);
    assert.ok(hover, "Expected a hover result for 'in'");
    assert.ok(hover.contents.length > 0, "Expected hover to have contents");
  });

  test("hovering on a node name shows node detail with inputs and outputs", async () => {
    const hover = await getHover("node filternode(input)(output)\n", 0, 6);
    assert.ok(hover, "Expected a hover result for node name 'filternode'");
    const contents = hover.contents;
    assert.ok(contents.length > 0, "Expected hover to have contents");
    const md = contents[0] as vscode.MarkdownString;
    assert.ok(md.value.includes("filternode"), "Expected node name in hover");
    assert.ok(md.value.includes("input"), "Expected inputs in hover");
    assert.ok(md.value.includes("output"), "Expected outputs in hover");
  });

  test("hovering on a model queue shows model detail with inputs and outputs", async () => {
    // Real grammar: model (inputs)(outputs) — no node name token
    const hover = await getHover("model (queueA)(queueB)\n", 0, 8);
    assert.ok(hover, "Expected a hover result when hovering on model queues");
    const md = hover.contents[0] as vscode.MarkdownString;
    assert.ok(md.value.includes("queueA"), "Expected inputs in hover");
    assert.ok(md.value.includes("queueB"), "Expected outputs in hover");
  });

  test("hovering on an unknown word returns undefined", async () => {
    const hover = await getHover("name myprocess\n", 0, 6);
    assert.strictEqual(hover, undefined, "Expected undefined for non-keyword");
  });

  test("hovering on 'input' alias returns same hover as 'in'", async () => {
    const hoverAlias = await getHover("input source.csv -> raw\n", 0, 1);
    const hoverCanon = await getHover("in source.csv -> raw\n", 0, 1);
    assert.ok(hoverAlias, "Expected hover for alias 'input'");
    assert.ok(hoverCanon, "Expected hover for canonical 'in'");
    const aliasValue = (hoverAlias.contents[0] as vscode.MarkdownString).value;
    const canonValue = (hoverCanon.contents[0] as vscode.MarkdownString).value;
    assert.strictEqual(
      aliasValue,
      canonValue,
      "Alias hover should match canonical hover",
    );
  });

  test("hovering on 'output' alias returns same hover as 'out'", async () => {
    const hoverAlias = await getHover("output queue_name -> dest\n", 0, 1);
    const hoverCanon = await getHover("out queue_name -> dest\n", 0, 1);
    assert.ok(hoverAlias, "Expected hover for alias 'output'");
    assert.ok(hoverCanon, "Expected hover for canonical 'out'");
    const aliasValue = (hoverAlias.contents[0] as vscode.MarkdownString).value;
    const canonValue = (hoverCanon.contents[0] as vscode.MarkdownString).value;
    assert.strictEqual(
      aliasValue,
      canonValue,
      "Alias hover should match canonical hover",
    );
  });

  test("hovering on 'process' alias returns same hover as 'subprocess'", async () => {
    const hoverAlias = await getHover("process myProc(a)(b) {}\n", 0, 1);
    const hoverCanon = await getHover("subprocess myProc(a)(b) {}\n", 0, 1);
    assert.ok(hoverAlias, "Expected hover for alias 'process'");
    assert.ok(hoverCanon, "Expected hover for canonical 'subprocess'");
    const aliasValue = (hoverAlias.contents[0] as vscode.MarkdownString).value;
    const canonValue = (hoverCanon.contents[0] as vscode.MarkdownString).value;
    assert.strictEqual(
      aliasValue,
      canonValue,
      "Alias hover should match canonical hover",
    );
  });

  test("hovering on a comment line returns undefined", async () => {
    const hover = await getHover("// name myprocess\n", 0, 4);
    assert.strictEqual(
      hover,
      undefined,
      "Expected undefined hover inside comment",
    );
  });

  test("hovering on all documented keywords returns a hover", async () => {
    const keywords = [
      "name",
      "type",
      "label",
      "lang",
      "in",
      "out",
      "node",
      "model",
      "db",
      "mode",
      "compress",
      "exceptq",
      "scenario",
      "unittest",
      "modelname",
      "descr",
      "subprocess",
      "getfact",
      "setfact",
      "getsig",
      "setsig",
      "getdyn",
      "setdyn",
      "where",
      "exec_when",
    ];
    for (const kw of keywords) {
      const hover = await getHover(`${kw} foo\n`, 0, 1);
      assert.ok(hover, `Expected hover for keyword '${kw}'`);
      assert.ok(
        hover.contents.length > 0,
        `Expected non-empty hover for '${kw}'`,
      );
    }
  });

  test("hovering on a subprocess name shows subprocess detail with inputs and outputs", async () => {
    // "subprocess mySubProc(a)(b)" — mySubProc starts at char 11
    const hover = await getHover("subprocess mySubProc(a)(b)\n", 0, 12);
    assert.ok(hover, "Expected a hover result for subprocess name 'mySubProc'");
    const md = hover.contents[0] as vscode.MarkdownString;
    assert.ok(
      md.value.includes("Subprocess"),
      "Expected 'Subprocess' label in hover",
    );
    assert.ok(
      md.value.includes("mySubProc"),
      "Expected subprocess name in hover",
    );
    assert.ok(md.value.includes("a"), "Expected inputs in hover");
    assert.ok(md.value.includes("b"), "Expected outputs in hover");
  });

  test("hovering on 'subprocess' keyword returns keyword doc, not subprocess detail", async () => {
    // char 1 is on the 'subprocess' keyword itself (before the name)
    const hover = await getHover("subprocess mySubProc(a)(b)\n", 0, 1);
    assert.ok(hover, "Expected a hover for 'subprocess' keyword");
    const md = hover.contents[0] as vscode.MarkdownString;
    assert.ok(
      md.value.includes("subprocess"),
      "Expected keyword doc for 'subprocess'",
    );
    // Should NOT include the detail label
    assert.ok(
      !md.value.includes("Subprocess:"),
      "Keyword hover should not show detail card",
    );
  });

  test("hovering on a queue name on a node line returns no detail hover", async () => {
    // "node mynode(rawdata)(result)" — 'rawdata' starts at char 12
    // rawdata is not a keyword or alias so hover should be undefined
    const hover = await getHover("node mynode(rawdata)(result)\n", 0, 13);
    assert.strictEqual(
      hover,
      undefined,
      "Expected no hover for non-keyword queue name on a node line",
    );
  });

  test("hovering on a node line with multiple comma-separated inputs captures all", async () => {
    // "node enrichnode(filtered, db_input)(enriched)" — 'enrichnode' starts at char 5
    const hover = await getHover(
      "node enrichnode(filtered, db_input)(enriched)\n",
      0,
      6,
    );
    assert.ok(hover, "Expected a hover for node name with multiple inputs");
    const md = hover.contents[0] as vscode.MarkdownString;
    assert.ok(md.value.includes("enrichnode"), "Expected node name in hover");
    assert.ok(md.value.includes("filtered"), "Expected first input in hover");
    assert.ok(md.value.includes("db_input"), "Expected second input in hover");
    assert.ok(md.value.includes("enriched"), "Expected output in hover");
  });

  test("hovering on 'model' keyword gives keyword doc, not model detail", async () => {
    // char 1 = on 'model' keyword; model detail fires for word !== 'model'
    const hover = await getHover("model (enriched)(scored)\n", 0, 1);
    assert.ok(hover, "Expected a hover for 'model' keyword");
    const md = hover.contents[0] as vscode.MarkdownString;
    // Keyword doc summary mentions 'model' but not the detail "Model\nInputs:"
    assert.ok(md.value.includes("`model`"), "Expected keyword doc for 'model'");
    assert.ok(
      !md.value.startsWith("Model\n"),
      "Keyword hover should not show model detail card",
    );
  });

  test("hovering on a non-word character returns undefined", async () => {
    // "node mynode(rawdata)(result)" — char 11 is '(' which is not a word character
    // getWordRangeAtPosition returns undefined → hover returns undefined
    const hover = await getHover("node mynode(rawdata)(result)\n", 0, 11);
    assert.strictEqual(
      hover,
      undefined,
      "Expected undefined hover on a non-word character",
    );
  });
});
