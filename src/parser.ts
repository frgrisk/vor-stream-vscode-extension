import { Token } from "antlr4";
import antlr4 from "antlr4";
import processLexer from "./_js_parser/processLexer";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const processParser = require("./_js_parser/processParser").default;

export function getTokensForCompletion(inputText: string): string[] {
  const chars = new antlr4.InputStream(inputText);
  const lexer = new processLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);

  tokens.fill();

  const tokenSet = new Set<string>(); // Use a Set for uniqueness
  tokens.tokens.forEach((token) => {
    if (token.type !== Token.EOF && token.text.trim()) {
      // Ignore EOF and empty tokens
      tokenSet.add(token.text);
    }
  });

  return Array.from(tokenSet);
}

export interface ParseError {
  line: number; // 1-based
  column: number; // 0-based
  length: number; // character count, minimum 1
  message: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class SyntaxErrorCollector extends (antlr4 as any).error.ErrorListener {
  readonly errors: ParseError[] = [];

  syntaxError(
    _recognizer: unknown,
    offendingSymbol: unknown,
    line: number,
    column: number,
    msg: string,
  ): void {
    let length = 1;
    if (
      offendingSymbol &&
      typeof offendingSymbol === "object" &&
      "start" in offendingSymbol &&
      "stop" in offendingSymbol
    ) {
      const sym = offendingSymbol as { start: number; stop: number };
      length = Math.max(1, sym.stop - sym.start + 1);
    }
    this.errors.push({ line, column, length, message: msg });
  }
}

export function getParseErrors(inputText: string): ParseError[] {
  const chars = new antlr4.InputStream(inputText);
  const lexer = new processLexer(chars);
  const lexerErrors = new SyntaxErrorCollector();
  lexer.removeErrorListeners();
  lexer.addErrorListener(lexerErrors);

  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new processParser(tokens);
  const parserErrors = new SyntaxErrorCollector();
  parser.removeErrorListeners();
  parser.addErrorListener(parserErrors);

  parser.parse();

  return [...lexerErrors.errors, ...parserErrors.errors];
}
