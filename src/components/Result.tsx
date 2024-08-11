import * as React from "react";
import { VFC, useRef, useState, useEffect, createRef } from "react";
import JsonView from "@uiw/react-json-view";

export const Result: VFC<{ size: number }> = (props) => {
  const [value, setValue] = useState<{ value: any } | null>(null);

  useEffect(() => {
    // expose via global var to playground-result module
    (globalThis as any).resultSetValue = (value: { value: any } | null) => {
      setValue(value);
    };
  }, [setValue]);

  if (!value) {
    return;
  }

  console.log("typeof value", typeof value, value);

  if (
    value.value === null ||
    typeof value.value === "number" ||
    typeof value.value === "bigint" ||
    typeof value.value === "boolean"
  ) {
    return <pre>{value.value}</pre>;
  }

  if (typeof value.value === "string") {
    return <pre>{JSON.stringify(value.value)}</pre>;
  }

  return (
    <JsonView
      enableClipboard={false}
      objectSortKeys={false}
      displayDataTypes={false}
      displayObjectSize={false}
      collapsed={false}
      value={value.value}
    />
  );
};
