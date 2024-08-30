# typesafe-query-builder-playground

[TRY IT NOW](https://hoeck.github.io/typesafe-query-builder-playground/)

## Development

0. Install

```
npm install
```

1. Build all playground files:

```
npm run build-playground-sources
npm run copy-query-builder-sources
```

2. Run the vite dev server:

```
npm run dev
```

## Built with

- [PGlite](https://pglite.dev/) - tiny real Postgres server that runs in the browser using WASM
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - somehow supports Typescript out of the box
- [Mantine](https://mantine.dev/) - surprised how good this React component library is

and Typescript, React, Vite - my goto stack atm.
