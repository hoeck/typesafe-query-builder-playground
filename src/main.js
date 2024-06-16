import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom";
import { Editor } from "./components/Editor";
import "./userWorker";

ReactDOM.render(
  _jsx(React.StrictMode, { children: _jsx(Editor, {}) }),
  document.getElementById("root")
);
