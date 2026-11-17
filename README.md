# TabCollector Browser Extension

TabCollector is a lightweight Chrome and Edge extension built with Manifest V3. It saves text entries and the active tab URL locally in browser storage.

## Features

- Save text entered in the popup
- Save the URL of the active browser tab
- Edit or delete saved entries
- Delete all saved entries
- Keep data available locally with `localStorage`

## Prerequisites

- [Node.js](https://nodejs.org/) (a recent LTS release is recommended)
- [pnpm](https://pnpm.io/) (the repository specifies `pnpm@12.18.0`)
- Chrome or Microsoft Edge

## TypeScript setup

The project uses TypeScript 7 with strict type checking:

- Source files are in `src/`.
- TypeScript compiles into `dist/` via `tsc`.
- `tsconfig.json` targets ES2022 and emits ES modules.
- Chrome types from `@types/chrome` provide browser API typings.
- Strict checking, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes` are enabled.
- The popup loads the compiled entry point from `dist/script.js`.

Install dependencies:

```bash
pnpm install
```

Compile the TypeScript source:

```bash
pnpm build
```

Compile automatically while TypeScript files change:

```bash
pnpm build:watch
```

Because `index.html` references `dist/script.js`, run the build before loading or testing the compiled extension in a browser.

## Project structure

```text
.
├── index.html                 # Extension popup markup
├── manifest.json              # Chrome/Edge Manifest V3 configuration
├── package.json               # pnpm scripts and development dependencies
├── pnpm-lock.yaml             # Locked dependency versions
├── pnpm-workspace.yaml        # pnpm workspace configuration
├── style.css                  # Popup styles
├── tsconfig.json              # TypeScript compiler configuration
├── vitest.config.ts           # Vitest configuration
├── src/
│   ├── script.ts              # Popup initialization and browser interactions
│   ├── items.ts               # Add, update, and delete item operations
│   ├── storage.ts             # localStorage loading and persistence
│   └── ui.ts                  # Popup rendering and UI helpers
├── tests/
│   ├── items.test.ts          # Item-operation unit tests
│   └── storage.test.ts        # Storage unit tests
└── dist/                      # Generated JavaScript and source maps
```

## Run the extension locally

1. Install dependencies and build the project:

   ```bash
   pnpm install
   pnpm build
   ```

2. Open `chrome://extensions` in Chrome or `edge://extensions` in Edge.

3. Enable **Developer mode**.

4. Choose **Load unpacked**.

5. Select the repository root directory.

The extension popup is available from the browser toolbar. After making source changes, run `pnpm build` again before reloading the extension.

## Testing

Tests use Vitest with the jsdom environment. Run the complete test suite once:

```bash
pnpm test
```

Run tests in watch mode during development:

```bash
pnpm test:watch
```

Vitest automatically discovers test files such as:

- `tests/items.test.ts`
- `tests/storage.test.ts`

To run one test file:

```bash
pnpm exec vitest run tests/items.test.ts
```

To run tests by name:

```bash
pnpm exec vitest run -t "test name"
```

## Development workflow

```bash
pnpm install
pnpm build:watch
pnpm test:watch
```

Keep the watch processes running while editing TypeScript files. Rebuild and reload the unpacked extension in the browser to verify popup behavior.

## Manifest permissions

The Manifest V3 file requests the `activeTab` permission, which allows the extension to inspect the current tab when the **SAVE TAB URL** action is used.
