# VOR AI Chatbot Extension

Chat with our AI chatbot directly in VS Code. This allows developers to interact with the VOR AI chatbot to get help with implementation, `.strm` coding questions, creating processes, and more right within their development environment. The extension opens a Webview that displays the VOR Angular chat UI, enabling users to communicate with the AI chatbot seamlessly.

This extension is designed to work with the VOR CLI, which must be installed and configured on your system. It automatically handles OIDC token generation for secure access to the chatbot. Be sure to have the VOR CLI installed and logged in on your machine before using this extension.

---

## Features

This extension provides the following features:

- Chat with the VOR AI chatbot directly in VS Code
- Uses the VOR Angular chat UI for a rich user experience
- Opens your VOR Angular chat UI in a VS Code Webview
- Automatically obtains an OIDC token via `vor create token`
- Falls back to error messages if not logged in
- Configuration option for your VOR server base‑URL

---

## Installation

### From the Marketplace (future)

Currently not available on the Marketplace, but will be soon. Once available, you can install it directly from the VS Code Marketplace by searching for "VOR Chatbot" and installing the extension.

```text
ext install vor-chatbot
```

### From VSIX

Recommended for local development or testing:

1. Run locally to package:

   ```bash
   npm install -g vsce
   vsce package
   # → creates: vor-chatbot-1.0.0.vsix
   ```

2. In VS Code, press **⇧⌘P** / **Ctrl+Shift+P** → **Extensions: Install from VSIX...** → select your `.vsix`.

> [!NOTE]
> Make sure that the VS Code instance you are installing the extension into is running on the machine where VOR CLI is installed and configured, otherwise the extension will not be able to generate the OIDC token required for authentication!

---

## Configuration

Open **File → Preferences → Settings**, search **“VOR Chatbot”**, and set:

| Setting              | Default                               | Description                                                            |
| -------------------- | ------------------------------------- | ---------------------------------------------------------------------- |
| `vorChatbot.baseUrl` | `https://vor-02.vsd.frgrisk.com:8081` | Base URL of your VOR server (must be reachable and running `vor` CLI). |

Or in your `settings.json`:

```jsonc
{
  "vorChatbot.baseUrl": "https://my-vor-host.example.com:8081",
}
```

Alternatively, search for the **VOR Chatbot** extension and click on the gear icon to access the **Extension Settings**. You can then modify the `vorChatbot.baseUrl` setting directly from there.

---

## Usage

1. **Open the command palette**: **⇧⌘P** / **Ctrl+Shift+P**
2. Run **VOR: Open Chatbot**
3. The extension:
   - Executes `vor create token` in the background
   - If **no token**, prompts you to run `vor login` first
   - Otherwise opens a Webview to

     ```
     <baseUrl>/chat?auth=<your‑token>
     ```

---

## Development

### Prerequisites

- VS Code
- Node.js (for packaging / dev)
- `vor` CLI installed & in your `$PATH`

### Run locally

1. **Open this folder** in your local VS Code.
2. Press **F5** → a new **Extension Development Host** window opens with your extension active. Alternatively, you can use the **Run** panel to start the extension automatically.
3. In the Dev Host window, run **⇧⌘P** / **Ctrl+Shift+P** → **VOR: Open Chatbot** to sanity‑check.

### Build & watch

```bash
npm install
npm run compile     # one‑off build
npm run watch       # continuous (add in your package.json scripts if you like)
```

---

## Troubleshooting

- **“Failed to create token”** → ensure `vor login` has been completed and `vor` is in your PATH.
- **No extension in Install‑Local list** → be sure your Dev Host (F5) is still open on your local machine when you invoke **Install Local Extension on Host…**.
- **404 or CORS errors in iframe** → verify `vorChatbot.baseUrl` matches your running Angular server (including protocol & port).
- **Webview blank** → check DevTools: in the Webview window press **⌥⌘I** / **Ctrl+Shift+I** to open its console & network logs.

---

Enjoy chatting with VOR AI directly inside your editor! 🚀
