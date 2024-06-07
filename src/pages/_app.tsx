import type { AppProps } from "next/app";
import Head from "next/head";
import { CssBaseline, ThemeProvider, createTheme, useMediaQuery } from "@mui/material";
import Container from "@mui/material/Container";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { theme } from "lib/theme";
import "../styles/reset.scss";
import { Topbar } from "components/layout";
import { useMemo } from "react";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const userPrefersTheme = useMediaQuery("(prefers-color-scheme: dark)") ? "dark" : "light";

  const userTheme = useMemo(
    () => createTheme({ ...theme(userPrefersTheme), palette: { mode: userPrefersTheme } }),
    [userPrefersTheme]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={userTheme}>
        <CssBaseline />
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
        </Head>
        <Topbar />
        <Container maxWidth="xl" sx={{ paddingY: 3 }}>
          <Component {...pageProps} />
        </Container>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
