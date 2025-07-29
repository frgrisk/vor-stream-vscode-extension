import * as vscode from "vscode";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

/**
 * Activate the extension and register the chat sidebar view provider.
 * This function is called when the extension is activated in VS Code.
 * It registers a webview view provider for the chat sidebar, allowing users
 * to interact with the VOR chatbot directly within the VS Code interface.
 *
 * @param context The extension context provided by VS Code
 */
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      ChatSidebarProvider.viewType,
      new ChatSidebarProvider(context),
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
      },
    ),
  );
}

/**
 * Deactivate the extension.
 * This function is called when the extension is deactivated in VS Code.
 */
export function deactivate() {
  // No specific cleanup needed for this extension
}

/**
 * ChatSidebarProvider is a class that implements the vscode.WebviewViewProvider interface.
 * It provides a webview view for the VOR chatbot sidebar in VS Code.
 * The view allows users to interact with the chatbot, including sending messages
 * and receiving responses, all within a webview embedded in the VS Code interface.
 */
class ChatSidebarProvider implements vscode.WebviewViewProvider {
  /**
   * The unique view type identifier for the chat sidebar.
   * This is used to register and identify the webview view provider.
   */
  public static readonly viewType = "vorChatbot.sidebarView";

  /**
   * Constructor for the ChatSidebarProvider class.
   * It initializes the provider with the extension context.
   *
   * @param ctx The extension context provided by VS Code
   */
  constructor(private readonly ctx: vscode.ExtensionContext) {}

  /**
   * This method is called when the webview view is resolved.
   * It sets up the webview with the necessary options and HTML content.
   * It also handles messages from the webview, such as opening login links.
   *
   * @param webviewView The webview view that is being resolved
   */
  public async resolveWebviewView(webviewView: vscode.WebviewView) {
    // allow scripts
    webviewView.webview.options = { enableScripts: true };

    // read baseUrl from user settings
    const config = vscode.workspace.getConfiguration("vorChatbot");
    const baseUrlRaw = config.get<string>("baseUrl")!;
    const baseUrl = baseUrlRaw.replace(/\/+$/, "");

    // run the CLI to create a token
    let token: string;
    try {
      const { stdout } = await execPromise("vor create token");
      token = stdout.trim();
      if (token.startsWith("Valid Vault token not found")) {
        webviewView.webview.html = this.errorHtml(
          "VOR: No valid Vault token found. Please run `vor login` first.",
        );
        return;
      }
    } catch {
      webviewView.webview.html = this.errorHtml(
        "VOR: Failed to create token. Ensure `vor` is installed and on your PATH.",
      );
      return;
    }

    // build and load the chat URL
    const chatUrl = `${baseUrl}/chat?auth=${encodeURIComponent(token)}`;
    webviewView.webview.html = getHtml(chatUrl);

    // forward openLogin messages
    webviewView.webview.onDidReceiveMessage((message) => {
      if (message.type === "openLogin" && message.uri) {
        vscode.env.openExternal(vscode.Uri.parse(message.uri));
      }
    });
  }

  /**
   * Generates an HTML string to display an error message in the webview.
   * This is used when there are issues with loading the chatbot or creating a token.
   *
   * @param msg The error message to display
   * @returns A string containing the HTML for the error page
   */
  private errorHtml(msg: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>VOR Chatbot</title></head>
<body style="font-family: sans-serif; padding:1em;">
  <h2>VOR Chatbot</h2>
  <p style="color: red;">${msg}</p>
</body>
</html>`;
  }
}

/**
 * Generates the HTML content for the webview that displays the chatbot interface.
 * This includes a script to handle messages from the webview and an iframe to load the chat URL.
 *
 * @param src The source URL for the chat interface
 * @returns A string containing the HTML for the webview
 */
function getHtml(src: string): string {
  // Note: acquireVsCodeApi is only defined inside a VS Code webview
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    http-equiv="Content-Security-Policy"
    content="
      default-src 'none';
      frame-src *;
      script-src * 'unsafe-inline' 'unsafe-eval';
      style-src * 'unsafe-inline';
      connect-src *;
    "
  />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
    }
      
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
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
