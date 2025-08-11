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
   * It also handles messages from the webview, such as opening login links
   * and catching authentication errors surfaced by the chat iframe.
   *
   * @param webviewView The webview view that is being resolved
   */
  public async resolveWebviewView(webviewView: vscode.WebviewView) {
    // allow scripts
    webviewView.webview.options = { enableScripts: true };

    // Register message handler
    webviewView.webview.onDidReceiveMessage((message) => {
      if (message.type === "openLogin" && message.uri) {
        vscode.env.openExternal(vscode.Uri.parse(message.uri));
      }
      if (message.type === "authError" && typeof message.status === "number") {
        const detail =
          message.status === 401 || message.status === 403
            ? "Unauthorized or expired token. Please run `vor login` again."
            : `Server error (${message.status}). Try again later.`;
        webviewView.webview.html = this.errorHtml(`VOR: ${detail}`);
      }
    });

    // Run the CLI to create a token
    let token: string;
    try {
      const { stdout, stderr } = await execPromise("vor create token");
      const combinedOutput = `${stdout}\n${stderr}`;

      // Detect unauthenticated case: prompt user to run `vor login` instead of interactive flow
      if (
        combinedOutput.includes(
          "Valid Vault token not found. Authentication required.",
        )
      ) {
        webviewView.webview.html = this.errorHtml(
          "VOR: Not authenticated. Please run `vor login` first.",
        );
        return;
      }

      token = stdout.trim();
      if (!token) {
        // Unexpected empty token
        webviewView.webview.html = this.errorHtml(
          "VOR: Received empty token. Please run `vor login` and try again.",
        );
        return;
      }
    } catch (err: any) {
      const errOut = (
        (err && (err.stdout || "")) +
        "\n" +
        (err && (err.stderr || ""))
      ).toString();

      // If the error output contains the unauthenticated indicator, tell user to login
      if (
        errOut.includes("Valid Vault token not found. Authentication required.")
      ) {
        webviewView.webview.html = this.errorHtml(
          "VOR: Not authenticated. Please run `vor login` first.",
        );
        return;
      }

      // Generic failure (e.g., `vor` not installed or PATH issue)
      webviewView.webview.html = this.errorHtml(
        "VOR: Failed to create token. Ensure `vor` is installed and on your PATH.",
      );
      return;
    }

    // Read baseUrl from user settings
    const config = vscode.workspace.getConfiguration("vorChatbot");
    const baseUrlRaw = config.get<string>("baseUrl") ?? "";
    const baseUrl = baseUrlRaw.replace(/\/+$/, "");

    // Build the chat URL and render the iframe wrapper
    const encodedToken = encodeURIComponent(token.trim());
    const chatUrl = `${baseUrl}/chat?auth=${encodedToken}`;
    webviewView.webview.html = getHtml(chatUrl);
  }

  /**
   * Generates an HTML string to display an error message in the webview.
   * This is used when there are issues with loading the chatbot or token.
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
 * It listens for `openLogin` and `authError` messages posted from inside the iframe.
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
    window.addEventListener("message", (event) => {
      const msg = event.data;
      if (msg?.type === "openLogin" && msg.uri) {
        vscode.postMessage(msg);
      }
      if (msg?.type === "authError" && typeof msg.status === "number") {
        vscode.postMessage({ type: "authError", status: msg.status });
      }
    });
  </script>
  
  <iframe src="${src}"></iframe>
</body>
</html>`;
}
