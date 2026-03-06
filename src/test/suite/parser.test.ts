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
    assert.ok(typeof err.message === "string", "message should be a string");
    assert.ok(err.line >= 1, "line should be 1-based");
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
});
