---
# You can also start simply with 'default'
theme: apple-basic
colorSchema: dark
# some information about your slides (markdown enabled)
title: Playground
# apply unocss classes to the current slide
class: text-center
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
fonts:
  # basically the text
  sans: Noto Color Emoji
  # use with `font-serif` css class from UnoCSS
  serif: Noto Color Emoji
  # for code blocks, inline code, etc.
  mono: Fira Code
---

# Building an SQL Playground SPA

---

# Building an SQL Playground SPA

➡️ https://hoeck.github.io/typesafe-query-builder-playground ⬅️

🥚🥕🥔 Ingredients:

1. [@electric-sql/pglite](https://github.com/electric-sql/pglite)
2. [monaco-editor](https://github.com/microsoft/monaco-editor)
3. [JS Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
4. [Vite](https://vitejs.dev/)
5. [mantine.dev](https://mantine.dev/)

---

# Postgres Database

easiest part:

```ts
const db = new PGlite();

await db.query("CREATE TABLE ids (id SERIAL PRIMARY KEY)");
```

🚀 WASM 🚀

---

# Monaco

Almost batteries included (for Typescript) but complex API and (IMO insufficient docs):

```ts
monaco.languages.typescript.typescriptDefaults.setCompilerOptions;
```

```ts
monaco.editor.createModel(
  JSON.stringify({ type: "module", types: "index.d.ts", main: "index.js" }),
  "typescript",
  monaco.Uri.parse("inmemory://model/node_modules/playground/package.json"),
);
```

Github search helped a lot.

---

# JS Modules

```ts
await eval(
  "import(" +
    JSON.stringify("data:text/javascript;charset=utf-8," + encodedJs) +
    ")",
);
```

No need to compile js any more 💪

---

# Vite, Mantine

Vite works almost out of the box.

Without mantine I wouldn't have been able to quickly prototype a UI.

---

# Summary

My goal is to make a database library more accessible.

And its quite doable.

Thanks to modern frontend tech ❤️

---

Thx for listening.

Feedback wanted.

Suggestions needed.

➡️ https://hoeck.github.io/typesafe-query-builder-playground ⬅️

<PoweredBySlidev mt-10 />
