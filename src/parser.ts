import { Token } from "antlr4";
import antlr4 from "antlr4";
import processLexer from "./_js_parser/processLexer";

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
