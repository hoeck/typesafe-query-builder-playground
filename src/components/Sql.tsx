import { useEffect, useState } from "react";

export const Sql = () => {
  const [values, setValues] = useState<{ query: string; params?: any[] }[]>([]);

  useEffect(() => {
    // expose via global var to playground-result module
    (globalThis as any).sqlLog = (query: string, params?: any[]) => {
      setValues((values) => [...values, { query, params }]);
    };
    (globalThis as any).sqlLogReset = () => {
      setValues([]);
    };

    return () => {
      (globalThis as any).sqlLog = undefined;
      (globalThis as any).sqlLogReset = undefined;
    };
  }, [setValues]);

  return (
    <div style={{ fontSize: "14px" }}>
      {(values || []).map((v, i) => (
        <pre key={i}>{v.query}</pre>
      ))}
    </div>
  );
};
