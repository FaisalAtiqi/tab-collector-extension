# TabCollector Browser Extension

TabCollector is a lightweight Chrome and Microsoft Edge browser extension built with Manifest V3. It allows you to quickly save text entries and active tab URLs locally, making it easy to keep track of useful links and information.

## Features

- Save text entries through the extension popup
- Save the URL of the active browser tab
- Edit saved entries
- Delete individual entries
- Delete all saved entries
- Persist saved entries locally using `localStorage`
- Open valid HTTP and HTTPS URLs directly from the saved list

## Tech Stack

- **TypeScript** – Application logic and type safety
- **HTML & CSS** – Popup structure and styling
- **Chrome Extensions API** – Access the active browser tab
- **localStorage** – Local data persistence
- **Vitest** – Unit and integration testing
- **jsdom** – DOM environment for testing

## Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- Google Chrome or Microsoft Edge

## Installation

Clone the repository:

```bash
git clone https://github.com/FaisalAtiqi/tab-collector-extension.git
cd tab-collector-extension
```

Install dependencies:

```bash
pnpm install
```

## Build

Compile the TypeScript source files:

```bash
pnpm build
```

The compiled JavaScript files are generated in the `dist/` directory.

To automatically compile when source files change:

```bash
pnpm build:watch
```

**Note:** The extension loads its JavaScript from `dist/script.js`, so you must build the project before loading it into your browser.

## Load the Extension

1. Open `chrome://extensions` in Chrome or `edge://extensions` in Microsoft Edge.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the root directory of the cloned repository.

The TabCollector extension should now appear in your browser's toolbar.

After modifying the TypeScript source files, run `pnpm build` and reload the extension to apply your changes.

## Testing

The project uses Vitest with the jsdom environment to test application logic, storage, UI rendering, and user interactions.

Run the complete test suite:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

Run an individual test file:

```bash
pnpm exec vitest run tests/items.test.ts
```

### Test Structure

- `items.test.ts` – Tests for adding, updating, and deleting items.
- `storage.test.ts` – Tests for loading, persisting, and clearing saved items.
- `ui.test.ts` – Tests for creating and rendering list elements.
- `script.test.ts` – Integration tests for saving, editing, and deleting items through the UI.

## Project Structure

```text
TabCollector extension/
├── src/
│   ├── items.ts              # Item management functions
│   ├── script.ts             # Application logic and event handling
│   ├── storage.ts            # Local storage utilities
│   └── ui.ts                 # UI creation and rendering
├── tests/
│   ├── items.test.ts         # Item management tests
│   ├── script.test.ts        # UI integration tests
│   ├── storage.test.ts       # Storage tests
│   └── ui.test.ts            # UI rendering tests
├── index.html                # Extension popup markup
├── manifest.json             # Manifest V3 configuration
├── style.css                 # Popup styling
├── package.json              # Dependencies and scripts
├── pnpm-lock.yaml            # Dependency lockfile
├── pnpm-workspace.yaml       # pnpm workspace configuration
├── tsconfig.json             # TypeScript configuration
├── vitest.config.ts          # Vitest configuration
└── .gitignore                # Ignored files and directories
```

## Manifest Permissions

The extension requests the `activeTab` permission, which allows it to access information about the currently active tab when saving its URL.

## License

This project is licensed under the ISC License.
