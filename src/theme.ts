import { MantineColorsTuple, createTheme } from "@mantine/core";

const myColor: MantineColorsTuple = [
  "#f0f9f3",
  "#e1f1e6",
  "#bee1ca",
  "#98d2aa",
  "#79c590",
  "#64bd80",
  "#5ab977",
  "#49a365",
  "#3f9059",
  "#307d4a",
];

export const theme = createTheme({
  colors: {
    myColor,
  },
});
