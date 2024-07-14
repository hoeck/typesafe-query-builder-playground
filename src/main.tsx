import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { theme } from "./theme";
import "./userWorker";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
