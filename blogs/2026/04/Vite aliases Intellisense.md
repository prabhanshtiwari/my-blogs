---
title: "⚡ Advanced Path Aliases + Full IntelliSense in React Vite (JavaScript)"
published: false
description: "Set up @components, @hooks, @utils aliases in Vite with JavaScript and get full VS Code autocomplete, suggestions, and click-to-navigate — all in one guide."
tags: vite, react, javascript, webdev
cover_image: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=400&fit=crop
---

# ⚡ Advanced Path Aliases + Full IntelliSense in React Vite (JavaScript)

> *Write `@components/Button` instead of `../../../components/Button` — and get autocomplete for it too.*

---

![Code Editor](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=400&fit=crop)

---

## 🧭 What This Guide Covers

This is the **complete, one-stop guide** for React + Vite + JavaScript developers who want:

- ✅ Clean `@alias` imports instead of fragile relative paths
- ✅ Full VS Code IntelliSense dropdown suggestions as you type
- ✅ Ctrl+Click to navigate to any aliased file
- ✅ Auto-import that fills in `@components/Button`, not `../../`
- ✅ Zero TypeScript required — pure JavaScript all the way

Let's build this from scratch.

---

## 😩 The Problem — Two Pains in One

If you've worked on a growing Vite + React app, you've felt both of these:

**Pain #1 — Relative Import Hell:**

```js
import Button from "../../../components/ui/Button";
import useAuth from "../../hooks/useAuth";
import { formatDate } from "../../../../utils/dateHelper";
import logo from "../../../assets/logo.svg";
```

Move one folder? Everything breaks. Onboard a new dev? They're lost.

**Pain #2 — No IDE Suggestions for Aliases:**

You've heard about `@components` imports. You try one. You type `import Button from "@comp` and... the IDE goes silent. No dropdown. No file browsing. Just a blinking cursor.

This guide kills both problems. Let's go.

---

## 🏗️ Project Structure

Here's the Vite + React + JavaScript project we're working with:

```
my-vite-app/
├── public/
├── src/
│   ├── assets/
│   │   └── logo.svg
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Modal.jsx
│   │   └── layout/
│   │       ├── Navbar.jsx
│   │       └── Footer.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Dashboard.jsx
│   ├── utils/
│   │   ├── formatDate.js
│   │   └── apiHelper.js
│   ├── services/
│   │   └── authService.js
│   ├── store/
│   │   └── useStore.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js        ← not .ts
└── jsconfig.json         ← not tsconfig.json
```

> 📝 **Note:** We're using `.js` / `.jsx` and `jsconfig.json` throughout — no TypeScript needed.

---

## 🔧 Part 1 — Setting Up Path Aliases

### Step 1 — Configure `vite.config.js`

Open (or create) `vite.config.js` at your project root:

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Needed in ESM (since __dirname doesn't exist in ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 📦 Components — import Button from "@components/ui/Button"
      "@components": path.resolve(__dirname, "src/components"),

      // 🪝 Hooks — import useAuth from "@hooks/useAuth"
      "@hooks":      path.resolve(__dirname, "src/hooks"),

      // 🛠️ Utilities — import { formatDate } from "@utils/formatDate"
      "@utils":      path.resolve(__dirname, "src/utils"),

      // 📄 Pages — import Dashboard from "@pages/Dashboard"
      "@pages":      path.resolve(__dirname, "src/pages"),

      // 🖼️ Assets — import logo from "@assets/logo.svg"
      "@assets":     path.resolve(__dirname, "src/assets"),

      // 🌐 Services — import { login } from "@services/authService"
      "@services":   path.resolve(__dirname, "src/services"),

      // 🗃️ Store — import useStore from "@store/useStore"
      "@store":      path.resolve(__dirname, "src/store"),
    },
  },
});
```

> ⚠️ **Why `fileURLToPath`?** Vite uses ES Modules by default, where `__dirname` is not defined. We recreate it using `import.meta.url`. This is a JavaScript-only gotcha — TypeScript projects use `__dirname` directly via `@types/node`.

---

### Step 2 — Configure `jsconfig.json`

This is the JavaScript equivalent of `tsconfig.json`. It tells VS Code's language server about your aliases so the editor can provide suggestions.

Create `jsconfig.json` at your project root:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@hooks/*":      ["src/hooks/*"],
      "@utils/*":      ["src/utils/*"],
      "@pages/*":      ["src/pages/*"],
      "@assets/*":     ["src/assets/*"],
      "@services/*":   ["src/services/*"],
      "@store/*":      ["src/store/*"]
    },
    "checkJs": false,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

> 🔑 **`baseUrl: "."`** is mandatory. Without it, the `paths` entries won't resolve and VS Code will ignore them entirely.

> 💡 **`checkJs: false`** keeps JavaScript type-checking off while still enabling IntelliSense. Set to `true` if you want JS type warnings.

---

### Step 3 — Verify Aliases Work

Restart your dev server and try using an alias:

```jsx
// src/pages/Dashboard.jsx
import Button from "@components/ui/Button";
import useAuth from "@hooks/useAuth";
import { formatDate } from "@utils/formatDate";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <Button>Click me</Button>
      <p>Welcome, {user?.name}</p>
      <p>Date: {formatDate(new Date())}</p>
    </div>
  );
}
```

Run `npm run dev` — if the page loads without errors, your aliases are working. ✅

---

## 🧠 Part 2 — Getting Full IntelliSense & Suggestions

Vite resolves aliases at build time — but VS Code needs separate configuration to show suggestions while you type. Here's how to unlock the full experience.

---

### Step 4 — VS Code Workspace Settings

Create `.vscode/settings.json` in your project root:

```json
{
  "javascript.preferences.importModuleSpecifier": "non-relative",
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "editor.quickSuggestions": {
    "strings": true
  },
  "editor.suggest.snippetsPreventQuickSuggestions": false,
  "path-intellisense.mappings": {
    "@components": "${workspaceRoot}/src/components",
    "@hooks":      "${workspaceRoot}/src/hooks",
    "@utils":      "${workspaceRoot}/src/utils",
    "@pages":      "${workspaceRoot}/src/pages",
    "@assets":     "${workspaceRoot}/src/assets",
    "@services":   "${workspaceRoot}/src/services",
    "@store":      "${workspaceRoot}/src/store"
  }
}
```

**What each setting does:**

| Setting | Effect |
|---------|--------|
| `importModuleSpecifier: "non-relative"` | VS Code auto-imports use `@components/Button` not `../../` |
| `quickSuggestions.strings: true` | Suggestions appear inside import string literals |
| `path-intellisense.mappings` | Path Intellisense extension browses your actual files |

---

### Step 5 — Install These VS Code Extensions

#### 🔌 Extension 1: Path Intellisense (Essential)

**Search in Extensions:** `Path Intellisense` by Christian Kohler  
**ID:** `christian-kohler.path-intellisense`

This extension reads the `path-intellisense.mappings` you added in Step 4 and shows **real file browser suggestions** as you type:

```js
import Button from "@components/  ← type this
                               ↓
                           ui/
                           layout/
```

Then:

```js
import Button from "@components/ui/  ← continue typing
                                  ↓
                              Button.jsx  ✅
                              Input.jsx
                              Modal.jsx
```

---

#### 🔌 Extension 2: JavaScript (ES6) Code Snippets (Recommended)

**Search:** `JavaScript (ES6) code snippets` by charalampos karypidis  
**ID:** `xabikos.JavaScriptSnippets`

Adds smart import snippets so you can type `imp` → Tab and get:

```js
import moduleName from 'module';
```

Then use your alias path with full suggestions. Small addition, big DX improvement.

---

#### 🔌 Extension 3: Auto Import (Bonus)

**Search:** `Auto Import` by steoates  
**ID:** `steoates.autoimport`

When you type `<Button` in JSX without importing it, this extension **automatically adds the import** at the top of your file using your alias path:

```jsx
// Auto-added by the extension ✨
import Button from "@components/ui/Button";
```

Because of the `importModuleSpecifier: "non-relative"` setting, it always uses the clean alias — not a relative path.

---

### Step 6 — Recommend Extensions to Your Team

Commit `.vscode/extensions.json` so teammates get prompted to install everything automatically:

```json
{
  "recommendations": [
    "christian-kohler.path-intellisense",
    "xabikos.JavaScriptSnippets",
    "steoates.autoimport"
  ]
}
```

When someone clones the repo, VS Code shows: *"This workspace recommends installing extensions."* One click — everyone is set up identically.

---

## 🚀 Part 3 — Real-World Usage Patterns

### Before vs. After — Side by Side

```jsx
// ❌ BEFORE — relative import chaos
import Navbar from "../../components/layout/Navbar";
import Button from "../../components/ui/Button";
import useAuth from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";
import { formatDate } from "../../utils/formatDate";
import { loginUser } from "../../services/authService";
import logo from "../../assets/logo.svg";
```

```jsx
// ✅ AFTER — clean, readable, refactor-proof
import Navbar from "@components/layout/Navbar";
import Button from "@components/ui/Button";
import useAuth from "@hooks/useAuth";
import useFetch from "@hooks/useFetch";
import { formatDate } from "@utils/formatDate";
import { loginUser } from "@services/authService";
import logo from "@assets/logo.svg";
```

---

### Barrel Files + Aliases = 🔥

Create `index.js` barrel files inside your folders to enable grouped imports:

```js
// src/components/ui/index.js
export { default as Button } from "./Button";
export { default as Input } from "./Input";
export { default as Modal } from "./Modal";
export { default as Card } from "./Card";
```

Now import everything in one line:

```js
// 🚀 One import, four components
import { Button, Input, Modal, Card } from "@components/ui";
```

This pattern is perfect for design systems. Add a new component to the barrel file, and it's immediately importable everywhere with full suggestions.

---

### Dynamic Imports + Aliases (Code Splitting)

Aliases work with dynamic imports too — Vite handles them at build time:

```js
// Lazy-load a page with code splitting
const Dashboard = React.lazy(() => import("@pages/Dashboard"));
const Settings = React.lazy(() => import("@pages/Settings"));
```

No extra config needed. Vite resolves `@pages` in dynamic imports just like static ones.

---

### Hooks Example

```js
// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { loginUser, logoutUser } from "@services/authService";  // ← alias in a hook!
import { saveToken } from "@utils/tokenHelper";

export function useAuth() {
  const [user, setUser] = useState(null);

  // ...

  return { user, login, logout };
}
```

Aliases work inside hooks, services, utils — anywhere in your `src/` folder.

---

## 🔍 Testing Your IntelliSense

Open any `.jsx` file and type this import from scratch:

```js
import  from "@
```

**You should see a dropdown like:**

```
💡 @assets/
💡 @components/
💡 @hooks/
💡 @pages/
💡 @services/
💡 @store/
💡 @utils/
```

Select `@components/` — you should then see:

```
💡 layout/
💡 ui/
```

Select `ui/` — you should see your actual files:

```
💡 Button.jsx
💡 Input.jsx
💡 Modal.jsx
```

If all three levels work — your setup is perfect. ✅

---

## 🐛 Troubleshooting

### ❌ No suggestions appearing at all

**Most likely cause:** Missing `baseUrl` in `jsconfig.json`.

**Fix:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",   ← make sure this line exists
    "paths": { ... }
  }
}
```

---

### ❌ `__dirname is not defined` error

**Cause:** You're using ES Modules and copied a CommonJS config.

**Fix:** Use this pattern in `vite.config.js`:

```js
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

---

### ❌ Aliases work in browser but VS Code shows red underlines

**Cause:** `jsconfig.json` is missing or not being picked up.

**Fix:** Make sure `jsconfig.json` is at the **root** of your project (same level as `package.json`), then:
```
Ctrl+Shift+P → Reload Window
```

---

### ❌ Auto-import still uses relative paths

**Cause:** The `importModuleSpecifier` setting isn't applied.

**Fix:** Make sure `.vscode/settings.json` has:
```json
"javascript.preferences.importModuleSpecifier": "non-relative"
```
Then reload VS Code.

---

### ❌ Aliases break in tests (Vitest)

**Fix:** Vitest inherits your `vite.config.js` automatically — no extra config needed. Just make sure you're using `vitest` and not Jest. If using Jest, add:

```js
// jest.config.js
module.exports = {
  moduleNameMapper: {
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@hooks/(.*)$":      "<rootDir>/src/hooks/$1",
    "^@utils/(.*)$":      "<rootDir>/src/utils/$1",
  },
};
```

---

## 📋 Complete Setup Checklist

Run through this when setting up a new project:

```
☐ vite.config.js has resolve.alias for all folders
☐ fileURLToPath used to recreate __dirname (ES Modules)
☐ jsconfig.json created at project root
☐ jsconfig.json has "baseUrl": "."
☐ jsconfig.json paths match vite.config.js aliases exactly
☐ .vscode/settings.json created with importModuleSpecifier: "non-relative"
☐ .vscode/settings.json has quickSuggestions.strings: true
☐ .vscode/settings.json has path-intellisense.mappings
☐ Path Intellisense extension installed
☐ Auto Import extension installed (optional)
☐ .vscode/extensions.json committed for team sharing
☐ VS Code reloaded after all changes
☐ Tested: typing "@" shows all alias namespaces
☐ Tested: Ctrl+Click on alias navigates to file
```

---

## 📁 Final File Reference

Here are all the files you need, complete and ready to copy:

### `vite.config.js`

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@hooks":      path.resolve(__dirname, "src/hooks"),
      "@utils":      path.resolve(__dirname, "src/utils"),
      "@pages":      path.resolve(__dirname, "src/pages"),
      "@assets":     path.resolve(__dirname, "src/assets"),
      "@services":   path.resolve(__dirname, "src/services"),
      "@store":      path.resolve(__dirname, "src/store"),
    },
  },
});
```

### `jsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@hooks/*":      ["src/hooks/*"],
      "@utils/*":      ["src/utils/*"],
      "@pages/*":      ["src/pages/*"],
      "@assets/*":     ["src/assets/*"],
      "@services/*":   ["src/services/*"],
      "@store/*":      ["src/store/*"]
    },
    "checkJs": false,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### `.vscode/settings.json`

```json
{
  "javascript.preferences.importModuleSpecifier": "non-relative",
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "editor.quickSuggestions": {
    "strings": true
  },
  "editor.suggest.snippetsPreventQuickSuggestions": false,
  "path-intellisense.mappings": {
    "@components": "${workspaceRoot}/src/components",
    "@hooks":      "${workspaceRoot}/src/hooks",
    "@utils":      "${workspaceRoot}/src/utils",
    "@pages":      "${workspaceRoot}/src/pages",
    "@assets":     "${workspaceRoot}/src/assets",
    "@services":   "${workspaceRoot}/src/services",
    "@store":      "${workspaceRoot}/src/store"
  }
}
```

### `.vscode/extensions.json`

```json
{
  "recommendations": [
    "christian-kohler.path-intellisense",
    "xabikos.JavaScriptSnippets",
    "steoates.autoimport"
  ]
}
```

---

## 💬 Final Thoughts

Setting up path aliases in a JavaScript Vite project is a two-step job that most tutorials only do halfway:

**Step 1 — Vite aliases** make your imports work at build time.  
**Step 2 — `jsconfig.json` + VS Code settings** make your IDE understand them.

Both halves together give you the experience you actually want: clean imports that your editor helps you write faster, navigate instantly, and never break when you refactor.

Three files changed. Fifteen minutes of setup. A lifetime of `../../` you'll never have to write again.

> *"The best code is the code you never have to think about."*

Happy coding. 🚀

---

*Tags: #vite #react #javascript #webdev*