import * as vscode from "vscode";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export function activate(ctx: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "chatbot.openIframe",
    async () => {
      // read baseUrl from user settings
      const config = vscode.workspace.getConfiguration("vorChatbot");
      const baseUrlRaw = config.get<string>("baseUrl")!;
      const baseUrl = baseUrlRaw.replace(/\/+$/, ""); // strip trailing slash

      // run the CLI to create a token
      let token: string;
      try {
        const { stdout } = await execPromise("vor create token");
        token = stdout.trim();
        if (token.startsWith("Valid Vault token not found")) {
          return vscode.window.showErrorMessage(
            "VOR: No valid Vault token found. Please run `vor login` first.",
          );
        }
      } catch (err) {
        return vscode.window.showErrorMessage(
          "VOR: Failed to create token. Ensure `vor` is installed and on your PATH.",
        );
      }

      // build the chat URL
      const chatUrl = `${baseUrl}/chat?auth=${encodeURIComponent(token)}`;

      // create the Webview panel
      const panel = vscode.window.createWebviewPanel(
        "vorChatbot",
        "VOR Chatbot",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        },
      );

      // set HTML content with the iframe
      panel.webview.html = getHtml(chatUrl);

      // handle messages from iframe
      panel.webview.onDidReceiveMessage((message) => {
        if (message.type === "openLogin" && message.uri) {
          vscode.env.openExternal(vscode.Uri.parse(message.uri));
        }
      });
    },
  );

  ctx.subscriptions.push(disposable);
}

export function deactivate() {}

function getHtml(src: string): string {
  // Note: acquireVsCodeApi is only defined inside a VS Code webview
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta
    http-equiv="Content-Security-Policy"
    content="
      default-src 'none';
      frame-src *;
      script-src * 'unsafe-inline' 'unsafe-eval';
      style-src * 'unsafe-inline';
      connect-src *;
    ">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VOR Chatbot</title>
  <style>
    html, body { margin:0; padding:0; height:100%; }
    iframe      { width:100%; height:100%; border:none; }
  </style>
</head>
<body>
  <script>
    const vscode = acquireVsCodeApi();
    window.addEventListener('message', event => {
      const msg = event.data;
      if (msg?.type === 'openLogin' && msg.uri) {
        vscode.postMessage(msg);
      }
    });
  </script>

  <iframe src="${src}"></iframe>
</body>
</html>`;
}
