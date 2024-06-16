# typesafe-query-builder-playground

- gh docs for hosting
- https://github.com/electric-sql/pglite to run pg in the browser
- https://github.com/fabiandev/typescript-playground
- simple build or no build at all (maybe preact + esbuild / rollup)?

- layout:
  ```
  +-----------+------------+------+
  | schema.ts | typescript | sql  |
  +-----------+            +------+
  |                               |
  |                               |
  |                               |
  +-------------------------------+
  | result / output               |
  |                               |
  +-------------------------------+
  ```

## pglite

- super easy to use with @electric-sql/pglite

## Monaco

- use monaco esm vite react example
- https://github.com/lukasbach/monaco-editor-auto-typings/ to fetch the library ?
- get compiled js:

```
const tsWorker = await monaco.languages.typescript.getTypeScriptWorker()
const files = await tsWorker.getScriptFileNames()
const emitted = await tsWorker.getEmitOutput(files[0])

console.log(emitted.outputFiles[0].text)
```

- how to edit multiple files?: playground file, schema file
  - or just use a single schema for now
