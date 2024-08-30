import JsonView from "@uiw/react-json-view";
import { useEffect, useState } from "react";

export const Result = () => {
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
      style={{ fontSize: "14px" }}
    />
  );
};
