# React + TypeScript + Vite
## 🚀 Live Demo
You can view the live application here:
[https://local-stream.onrender.com](https://local-stream.onrender.com)

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

# Local-Stream

Local-Stream is a local media streaming project built with Node.js, Express, TypeScript, and React/Vite. It allows chunk-based video uploads, stores media locally, and serves the files through a simple API.

## Features
- Chunk upload handling
- Local MP4 storage
- Static video serving through Express
- Video listing API
- React frontend UI

## Project structure
- `server/src/index.ts` — Express server entry point
- `server/src/uploadHandler.ts` — upload handler logic
- `server/storage/` — runtime video storage
- `client/` — frontend application

## Run locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Notes
- Uploaded media files are stored in `server/storage/`
- Generated runtime folders such as `server/storage/` and `server/uploads/` are ignored by Git
- This project is intended for local development and local media streaming

## Tech stack
- Node.js
- Express
- TypeScript
- React
- Vite
