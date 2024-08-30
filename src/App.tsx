import { Anchor, AppShell, Burger, Button, Group, Tabs } from "@mantine/core";
import "@mantine/core/styles.css";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import styles from "./App.module.css";
import { Editor, getJsCode } from "./components/Editor";
import { Log } from "./components/Log";
import { Result } from "./components/Result";
import { Sql } from "./components/Sql";

const PlaygroundMain: React.VFC = () => {
  const [width, setWidth] = React.useState(
    (window.visualViewport?.width || 0) / 2,
  );
  const [isMoving, setIsMoving] = React.useState(false);

  return (
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

          <Tabs.Panel value="log" style={{ overflow: "auto", width: "100%" }}>
            <Log />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
};

// MobileNavbar layout https://mantine.dev/app-shell/?e=MobileNavbar
export function App() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding=""
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Group>
              Typesafe Query Builder Playground
              <Button onClick={runCode}>RUN</Button>
            </Group>
            <Group ml="xl" gap={0} visibleFrom="sm">
              <Anchor
                className={styles.AppShellButton}
                href="https://github.com/hoeck/typesafe-query-builder"
                target="_blank"
              >
                Github
              </Anchor>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <Anchor
          className={styles.AppShellButton}
          href="https://github.com/hoeck/typesafe-query-builder"
          target="_blank"
        >
          Github
        </Anchor>
      </AppShell.Navbar>

      <AppShell.Main>
        <PlaygroundMain />
      </AppShell.Main>
    </AppShell>
  );
}

async function runCode() {
  (globalThis as any).resultSetValue(null);
  (globalThis as any).sqlLogReset();
  (globalThis as any).playgroundLogReset();

  const panelCode = await getJsCode();
  const timestampToForceReevaluation = `\n\nconst x${Date.now()} = false`;
  const encodedJs = encodeURIComponent(
    panelCode + timestampToForceReevaluation,
  );

  const _console = window.console;

  try {
    (window as any).console = {
      log: (window as any).playgroundLog,
    };

    await eval(
      "import(" +
        JSON.stringify("data:text/javascript;charset=utf-8," + encodedJs) +
        ")",
    );
  } catch (e) {
    (globalThis as any).playgroundLog(e.stack);
  } finally {
    window.console = _console;
  }
}
