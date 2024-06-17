import { VFC, useRef, useState, useEffect } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import styles from "./Editor.module.css";

const anyGlobalThis: any = globalThis;

export const Editor: VFC = () => {
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
          value: [
            "import {query} from 'typesafe-query-builder'",
            "",
            "",
            "",
            "",
          ].join("\n"),
          language: "typescript",
        });

        anyGlobalThis.globalEditor = monaco.editor;

        editorStartup(monacoEditor);

        return monacoEditor;
      });
    }

    return () => editor?.dispose();
  }, [monacoEl.current]);

  return <div className={styles.Editor} ref={monacoEl}></div>;
};

async function editorStartup(editor: monaco.editor.IStandaloneCodeEditor) {
  // TODO: a buildstep that copies the typesafe-query-builder files over to
  // dist/ as .txt to not mangle with vite dev server js processing

  const packageJsonSource = await (
    await fetch("dist/typesafe-query-builder.package.json.txt")
  ).text();

  monaco.editor.createModel(
    packageJsonSource,
    "typescript",
    monaco.Uri.parse(
      "inmemory://model/node_modules/typesafe-query-builder/package.json",
    ),
  );

  const indexDtsSource = await (
    await fetch("dist/typesafe-query-builder.index.d.ts.txt")
  ).text();

  monaco.editor.createModel(
    indexDtsSource,
    "typescript",
    monaco.Uri.parse(
      "inmemory://model/node_modules/typesafe-query-builder/dist/index.d.ts",
    ),
  );
}
