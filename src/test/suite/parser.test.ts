import * as assert from "assert";
import * as path from "path";
import * as fs from "fs";
import { getParseErrors, getTokensForCompletion } from "../../parser";

const VALID_STRM = fs.readFileSync(
  path.resolve(__dirname, "../../../src/test/fixtures/sample.strm"),
  "utf8",
);

suite("Parser: getParseErrors", () => {
  test("returns no errors for valid .strm", () => {
    const errors = getParseErrors(VALID_STRM);
    assert.strictEqual(
      errors.length,
      0,
      `Unexpected errors: ${JSON.stringify(errors)}`,
    );
  });

  test("returns errors for garbage input", () => {
    const errors = getParseErrors("@@@invalid@@@");
    assert.ok(errors.length > 0, "Expected at least one parse error");
  });

  test("returns errors for misused keyword", () => {
    const errors = getParseErrors("nod filternode(a)(b)");
    assert.ok(errors.length > 0, "Expected parse error for unknown keyword");
  });

  test("error has correct shape", () => {
    const errors = getParseErrors("@@@invalid@@@");
    assert.ok(errors.length > 0);
    const err = errors[0];
    assert.ok(typeof err.line === "number", "line should be a number");
    assert.ok(typeof err.column === "number", "column should be a number");
    assert.ok(typeof err.length === "number", "length should be a number");
    assert.ok(typeof err.message === "string", "message should be a string");
    assert.ok(err.line >= 1, "line should be 1-based");
    assert.ok(err.length >= 1, "length should be at least 1");
  });

  test("error line number is accurate for multi-line input", () => {
    const input = "name myprocess\ntype Default\n@@@ bad token\n";
    const errors = getParseErrors(input);
    assert.ok(errors.length > 0, "Expected at least one parse error");
    const err = errors[0];
    assert.strictEqual(err.line, 3, "Error should be reported on line 3");
    assert.strictEqual(err.column, 0, "Error should start at column 0");
  });

  test("error length matches token width", () => {
    // 'badkeyword' is a 10-character token that the parser will not recognise
    const errors = getParseErrors("badkeyword");
    assert.ok(errors.length > 0);
    const tokenErr = errors.find((e) => e.length === 10);
    assert.ok(
      tokenErr !== undefined,
      `Expected an error with length 10; got ${JSON.stringify(errors)}`,
    );
  });
});

suite("Parser: getTokensForCompletion", () => {
  test("returns tokens for valid .strm", () => {
    const tokens = getTokensForCompletion(VALID_STRM);
    assert.ok(tokens.length > 0, "Expected at least one token");
  });

  test("returns unique tokens only", () => {
    const tokens = getTokensForCompletion(VALID_STRM);
    const unique = new Set(tokens);
    assert.strictEqual(
      tokens.length,
      unique.size,
      "Tokens should be deduplicated",
    );
  });

  test("returns empty array for empty input", () => {
    const tokens = getTokensForCompletion("");
    assert.deepStrictEqual(tokens, []);
  });

  test("includes expected keyword and identifier tokens", () => {
    const tokens = getTokensForCompletion(VALID_STRM);
    for (const expected of [
      "name",
      "type",
      "node",
      "in",
      "out",
      "testprocess",
      "filternode",
      "enrichnode",
    ]) {
      assert.ok(tokens.includes(expected), `Expected token '${expected}'`);
    }
  });

  test("does not include punctuation or noise tokens", () => {
    const tokens = getTokensForCompletion(VALID_STRM);
    for (const noise of ["->", "(", ")", ";", "<EOF>"]) {
      assert.ok(!tokens.includes(noise), `Unexpected noise token '${noise}'`);
    }
  });
});
