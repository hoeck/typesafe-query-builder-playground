// escape functions from node-postgres utils
const escapeIdentifier = function (str: string) {
  return '"' + str.replace(/"/g, '""') + '"';
};

const escapeLiteral = function (str: string) {
  var hasBackslash = false;
  var escaped = "'";

  for (var i = 0; i < str.length; i++) {
    var c = str[i];
    if (c === "'") {
      escaped += c + c;
    } else if (c === "\\") {
      escaped += c + c;
      hasBackslash = true;
    } else {
      escaped += c;
    }
  }

  escaped += "'";

  if (hasBackslash === true) {
    escaped = " E" + escaped;
  }

  return escaped;
};

// database client for the playgrounds pglite instance
export const db = {
  query(
    sql: string,
    values: any[],
  ): Promise<{
    rows: Array<{ [key: string]: any }>;
    rowCount: number;
  }> {
    const pgLite: any = (globalThis as any).db;
    const sqlLog: any = (globalThis as any).sqlLog;

    if (!pgLite) {
      throw new Error("global pgLite is not initialized");
    }

    if (!sqlLog) {
      throw new Error("global sqlLog is not initialized");
    }

    sqlLog(sql, values);

    return pgLite.query(sql, values);
  },
  escapeLiteral(value: string): string {
    return escapeLiteral(value);
  },
  escapeIdentifier(value: string): string {
    return escapeIdentifier(value);
  },
};

// display a value in the results tab
export function show(value: any) {
  (globalThis as any).resultSetValue({ value });
}
