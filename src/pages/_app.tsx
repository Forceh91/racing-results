import type { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "@mui/material";
import Container from "@mui/material/Container";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { theme } from "lib/theme";
import "../styles/reset.scss";
import { Topbar } from "components/layout";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
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
