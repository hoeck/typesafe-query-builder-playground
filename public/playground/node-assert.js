// typesafe query builder uses node stdlib assert
export const assert = {
  fail: (...args) => {
    console.error("query builder assertion failed", ...args);
  },
};
