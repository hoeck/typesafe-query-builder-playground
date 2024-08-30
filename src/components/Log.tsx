import { useEffect, useState } from "react";

export const Log = () => {
  const [values, setValues] = useState<{ logParams: any[] }[]>([]);

  useEffect(() => {
    // expose via global var to playground-result module
    (globalThis as any).playgroundLog = (...logParams: any[]) => {
      setValues((values) => [...values, { logParams }]);
    };
    (globalThis as any).playgroundLogReset = () => {
      setValues([]);
    };

    return () => {
      (globalThis as any).playgroundLog = undefined;
      (globalThis as any).playgroundLogReset = undefined;
    };
  }, [setValues]);

  return (
    <div style={{ fontSize: "14px" }}>
      {values.map((v, i) => {
        const elements: React.ReactNode[] = [];

        v.logParams.forEach((p, i) => {
          if (typeof p === "object") {
            elements.push(JSON.stringify(p));
          } else if (p === "\n") {
            elements.push(<br key={(i + 2) ** 2} />);
          } else {
            elements.push(`${p}`);
          }

          elements.push(<span key={i}>&nbsp;</span>);
        });

        return <pre key={i}>{elements}</pre>;
      })}
    </div>
  );
};
