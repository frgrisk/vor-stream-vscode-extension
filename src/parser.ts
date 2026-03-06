import antlr4 from "antlr4";
import processLexer from "./_js_parser/processLexer";

export function getTokensForCompletion(inputText: string): string[] {
  const chars = new antlr4.InputStream(inputText);
  const lexer = new processLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);

  tokens.fill();

  // Only include keywords (types 30–93) and identifiers (type 94).
  // Excludes: punctuation/operators (T__0–T__24 = 1–25), SQLSTMTSEMICOLON (26),
  // NUMBER (27), STRING (28), SCOL (29), comments (95–96), whitespace (97–98),
  // and error tokens (99).
  const KEYWORD_MIN = processLexer.CHECK_CONSTRAINTS; // first keyword token (30)
  const IDENTIFIER = processLexer.IDENTIFIER; // identifier token (94)

  const tokenSet = new Set<string>();
  tokens.tokens.forEach((token) => {
    if (
      token.type >= KEYWORD_MIN &&
      token.type <= IDENTIFIER &&
      token.text.trim()
    ) {
      tokenSet.add(token.text);
    }
  });

  return Array.from(tokenSet);
}
