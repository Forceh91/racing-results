import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

export function Topbar() {
  return (
    <AppBar position="sticky" sx={{ marginBottom: 2 }}>
      <Container
        sx={{ height: "50px", display: "flex", alignItems: "center", a: { textDecoration: "none", color: "inherit" } }}
        maxWidth="xl"
      >
        <Typography variant="h6" noWrap component={Link} href="/" sx={{ fontWeight: 700 }}>
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Typography>
        <Box sx={{ ml: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component={Link} href="/">
            Events
          </Typography>
        </Box>
      </Container>
    </AppBar>
  );
}
