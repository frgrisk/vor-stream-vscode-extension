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
    return provider.provideHover(
      doc,
      new vscode.Position(line, character),
      cts.token,
    );
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
    const hover = await getHover("model mymodel(input)(output)\n", 0, 1);
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

  test("hovering on a model name shows model detail with inputs and outputs", async () => {
    const hover = await getHover("model mymodel(queueA)(queueB)\n", 0, 7);
    assert.ok(hover, "Expected a hover result for model name 'mymodel'");
    const md = hover.contents[0] as vscode.MarkdownString;
    assert.ok(md.value.includes("mymodel"), "Expected model name in hover");
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
      "exceptq",
      "scenario",
      "unittest",
      "modelname",
      "subprocess",
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
});
