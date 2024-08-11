import * as React from "react";
import { VFC, useRef, useState, useEffect, createRef } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import styles from "./Editor.module.css";

const anyGlobalThis: any = globalThis;

export const Editor: VFC<{ size: number }> = (props) => {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);

  useEffect(() => {
    if (monacoEl) {
      setEditor((editor) => {
        if (editor) return editor;

        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          experimentalDecorators: true,
          allowSyntheticDefaultImports: true,
          //jsx: this.monaco.languages.typescript.JsxEmit.React,
          moduleResolution:
            monaco.languages.typescript.ModuleResolutionKind.NodeJs,
          allowNonTsExtensions: true,
          target: monaco.languages.typescript.ScriptTarget.ES2020,
        });

        const monacoEditor = monaco.editor.create(monacoEl.current!, {
          value: ["// loading"].join("\n"),
          language: "typescript",
          minimap: { enabled: false },
        });

        anyGlobalThis.globalMonacoEditor = monacoEditor;
        anyGlobalThis.globalEditor = monaco.editor;

        editorStartup(monacoEditor).catch((e) => {
          console.error("error while loading editor files", e);
        });

        return monacoEditor;
      });
    }

    return () => {
      editor?.dispose();
    };
  }, [monacoEl.current]);

  useEffect(() => {
    function resize() {
      editor?.layout();
    }

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [editor]);

  useEffect(() => {
    editor?.layout();
  }, [props.size]);

  return (
    <div
      style={{ width: `${props.size}px` }}
      className={styles.Editor}
      ref={monacoEl}
    ></div>
  );
};

async function loadFileIntoEditor(params: {
  httpPath: string;
  monacoUri: string;
}) {
  const hasModel = monaco.editor
    .getModels()
    .some((m) => m.uri.toString() === params.monacoUri);

  if (!hasModel) {
    const source = await (await fetch(params.httpPath)).text();

    monaco.editor.createModel(
      source,
      "typescript",
      monaco.Uri.parse(params.monacoUri),
    );
  }
}

async function editorStartup(editor: monaco.editor.IStandaloneCodeEditor) {
  // TODO: a buildstep that copies the typesafe-query-builder files over to
  // dist/ as .txt to not mangle with vite dev server js processing

  const textModel = monaco.editor.getModel(
    monaco.Uri.parse("inmemory://model/1"),
  );

  if (textModel) {
    const exampleTs = await (await fetch("playground/example.ts")).text();

    textModel.setValue(exampleTs);
  }

  await loadFileIntoEditor({
    httpPath: "playground/typesafe-query-builder/package.json",
    monacoUri:
      "inmemory://model/node_modules/typesafe-query-builder/package.json",
  });

  await loadFileIntoEditor({
    httpPath: "playground/typesafe-query-builder/dist/index.d.ts",
    monacoUri:
      "inmemory://model/node_modules/typesafe-query-builder/dist/index.d.ts",
  });

  await loadFileIntoEditor({
    httpPath: "playground/typesafe-query-builder/dist/index.d.ts",
    monacoUri:
      "inmemory://model/node_modules/typesafe-query-builder/dist/index.d.ts",
  });

  // fake "playground-database" lib
  monaco.editor.createModel(
    JSON.stringify({ type: "module", types: "index.d.ts", main: "index.js" }),
    "typescript",
    monaco.Uri.parse(
      "inmemory://model/node_modules/playground-database/package.json",
    ),
  );

  await loadFileIntoEditor({
    httpPath: "playground/playground-database.d.ts",
    monacoUri: "inmemory://model/node_modules/playground-database/index.d.ts",
  });
}

export async function getJsCode() {
  const models = monaco.editor
    .getModels()
    .filter((m) => m.uri.toString().endsWith("/1"));
  const tsWorker = await (
    await monaco.languages.typescript.getTypeScriptWorker()
  )(...models.map((m) => m.uri));
  const emitted = await tsWorker.getEmitOutput(models[0].uri.toString());

  return emitted.outputFiles[0].text;
}
