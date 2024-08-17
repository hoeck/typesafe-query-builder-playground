import "@mantine/core/styles.css";
import React from "react";
import styles from "./App.module.css";
import { Editor, getJsCode } from "./components/Editor";
import { Result } from "./components/Result";

export const App: React.VFC = () => {
  const [width, setWidth] = React.useState(
    (window.visualViewport?.width || 0) / 2,
  );
  const [isMoving, setIsMoving] = React.useState(false);

  return (
    <>
      <h1 className={styles.Header}>Typesafe Query Builder Playground</h1>
      <button onClick={runCode}>RUN</button>
      <div className={styles.Panels}>
        <div className={styles.Editor}>
          <Editor size={width} />;
        </div>
        <div
          className={styles.Divider}
          onPointerDown={(ev) => {
            ev.currentTarget.setPointerCapture(ev.pointerId);
            setIsMoving(true);
          }}
          onPointerUp={(ev) => {
            ev.currentTarget.releasePointerCapture(ev.pointerId);
            setIsMoving(false);
          }}
          onPointerMove={(ev) => {
            if (isMoving) {
              const newWidth = Math.max(
                200,
                Math.min((window.visualViewport?.width || 0) - 200, ev.clientX),
              );

              setWidth(newWidth);
            }
          }}
        />
        <div className={styles.Result}>
          <Result />
        </div>
      </div>
    </>
  );
};

async function runCode() {
  const panelCode = await getJsCode();
  const timestampToForceReevaluation = `\n\nconst x${Date.now()} = false`;
  const encodedJs = encodeURIComponent(
    panelCode + timestampToForceReevaluation,
  );

  await eval(
    "import(" + `data:text/javascript;charset=utf-8,${encodedJs}` + ")",
  );
}
