import { createTheme } from "@mui/material";

import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const theme = createTheme({
  typography: {
    fontFamily: inter.style.fontFamily,
    body1: { fontSize: "1.6rem" },
    body2: { fontSize: "1.6rem" },
    h1: { fontSize: "3.4rem" },
    h2: { fontSize: "3.1rem" },
    h3: { fontSize: "2.8rem" },
    h4: { fontSize: "2.5rem" },
    h5: { fontSize: "2.2rem" },
    h6: { fontSize: "1.9rem" },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#f9f9f9",
          boxShadow: "0 2px 2px -2px rgba(0,0,0,.2);",
          color: "#111",
        },
      },
    },
  },
});
