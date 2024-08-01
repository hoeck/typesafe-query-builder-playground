export const assert = {
  fail: (...args) => {
    console.error("query builder assertion failed", ...args);
  },
};
