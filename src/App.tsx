import { Button, Tabs, Title } from "@mantine/core";
import "@mantine/core/styles.css";
import React from "react";
import styles from "./App.module.css";
import { Editor, getJsCode } from "./components/Editor";
import { Result } from "./components/Result";
import { Sql } from "./components/Sql";

export const App: React.VFC = () => {
  const [width, setWidth] = React.useState(
    (window.visualViewport?.width || 0) / 2,
  );
  const [isMoving, setIsMoving] = React.useState(false);

  return (
    <>
      <Title className={styles.Header}>Typesafe Query Builder Playground</Title>
      <Button onClick={runCode}>RUN</Button>
      <div className={styles.Panels}>
        <div className={styles.Editor}>
          <Tabs variant="outline" defaultValue="example">
            <Tabs.List pl="lg">
              <Tabs.Tab value="example">example.ts</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="example">
              <Editor size={width} />;
            </Tabs.Panel>
          </Tabs>
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
          <Tabs variant="outline" defaultValue="result">
            <Tabs.List pl="lg">
              <Tabs.Tab value="result">Result</Tabs.Tab>
              <Tabs.Tab value="sql">SQL</Tabs.Tab>
              <Tabs.Tab value="log">Log</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="result">
              <Result />
            </Tabs.Panel>

            <Tabs.Panel value="sql">
              <Sql />
            </Tabs.Panel>

            <Tabs.Panel value="log">LOG</Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </>
  );
};

async function runCode() {
  (globalThis as any).sqlLogReset();
  (globalThis as any).resultSetValue(null);

  const panelCode = await getJsCode();
  const timestampToForceReevaluation = `\n\nconst x${Date.now()} = false`;
  const encodedJs = encodeURIComponent(
    panelCode + timestampToForceReevaluation,
  );

  await eval(
    "import(" +
      JSON.stringify("data:text/javascript;charset=utf-8," + encodedJs) +
      ")",
  );
}
