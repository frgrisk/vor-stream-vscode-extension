import * as assert from "assert";
import * as vscode from "vscode";
import { createDocumentSymbolProvider } from "../../documentSymbolProvider";

async function getSymbols(content: string): Promise<vscode.DocumentSymbol[]> {
  const doc = await vscode.workspace.openTextDocument({
    content,
    language: "strm",
  });
  const provider = createDocumentSymbolProvider();
  return provider.provideDocumentSymbols(
    doc,
    new vscode.CancellationTokenSource().token,
  ) as vscode.DocumentSymbol[];
}

suite("DocumentSymbolProvider", () => {
  test("name statement produces Module symbol", async () => {
    const symbols = await getSymbols("name myprocess\n");
    const sym = symbols.find((s) => s.detail === "name");
    assert.ok(sym, "Expected a 'name' symbol");
    assert.strictEqual(sym.name, "myprocess");
    assert.strictEqual(sym.kind, vscode.SymbolKind.Module);
  });

  test("node statement produces Function symbol", async () => {
    const symbols = await getSymbols("node filternode(a)(b)\n");
    const sym = symbols.find((s) => s.detail === "node");
    assert.ok(sym, "Expected a 'node' symbol");
    assert.strictEqual(sym.name, "filternode");
    assert.strictEqual(sym.kind, vscode.SymbolKind.Function);
  });

  test("model statement produces Class symbol", async () => {
    const symbols = await getSymbols("model mymodel(a)(b)\n");
    const sym = symbols.find((s) => s.detail === "model");
    assert.ok(sym, "Expected a 'model' symbol");
    assert.strictEqual(sym.name, "mymodel");
    assert.strictEqual(sym.kind, vscode.SymbolKind.Class);
  });

  test("in statement produces Event symbol", async () => {
    const symbols = await getSymbols("in input.csv -> raw_input\n");
    const sym = symbols.find((s) => s.detail === "in");
    assert.ok(sym, "Expected an 'in' symbol");
    assert.strictEqual(sym.name, "input.csv → raw_input");
    assert.strictEqual(sym.kind, vscode.SymbolKind.Event);
  });

  test("out statement produces Event symbol", async () => {
    const symbols = await getSymbols("out enriched -> output.csv\n");
    const sym = symbols.find((s) => s.detail === "out");
    assert.ok(sym, "Expected an 'out' symbol");
    assert.strictEqual(sym.name, "enriched → output.csv");
    assert.strictEqual(sym.kind, vscode.SymbolKind.Event);
  });

  test("blank lines and comments produce no symbols", async () => {
    const symbols = await getSymbols("\n// a comment\n/* block comment */\n\n");
    assert.strictEqual(symbols.length, 0, "Expected no symbols");
  });

  test("full fixture produces all top-level symbols", async () => {
    const content = [
      "name testprocess",
      "type Default",
      "in input.csv -> raw_input",
      "node filternode(raw_input)(filtered)",
      "node enrichnode(filtered)(enriched) lang=go",
      "out enriched -> output.csv",
    ].join("\n");
    const symbols = await getSymbols(content);
    const details = symbols.map((s) => s.detail);
    assert.ok(details.includes("name"), "Expected name symbol");
    assert.ok(details.includes("in"), "Expected in symbol");
    assert.ok(details.includes("out"), "Expected out symbol");
    const nodeSymbols = symbols.filter((s) => s.detail === "node");
    assert.strictEqual(nodeSymbols.length, 2, "Expected 2 node symbols");
  });

  test("nodes inside subprocess are nested as children", async () => {
    const content = [
      "subprocess mysubproc(a)(b) {",
      "  node innernode(a)(b)",
      "}",
    ].join("\n");
    const symbols = await getSymbols(content);
    const subproc = symbols.find((s) => s.detail === "subprocess");
    assert.ok(subproc, "Expected a subprocess symbol");
    assert.strictEqual(subproc.children.length, 1, "Expected 1 child node");
    const firstChild = subproc.children[0];
    assert.ok(firstChild, "Expected a child node");
    assert.strictEqual(firstChild.name, "innernode");
  });
});
