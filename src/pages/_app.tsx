import type { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "@mui/material";
import Container from "@mui/material/Container";
import { theme } from "lib/theme";
import "../styles/reset.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <Container sx={{ paddingY: 3 }}>
        <Component {...pageProps} />
      </Container>
    </ThemeProvider>
  );
}
