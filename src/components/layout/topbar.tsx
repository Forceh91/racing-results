import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export function Topbar() {
  return (
    <AppBar position="sticky" sx={{ marginBottom: 2 }}>
      <Container sx={{ height: "50px", display: "flex", alignItems: "center" }} maxWidth="xl">
        <Typography
          variant="h6"
          noWrap
          component={Link}
          href="/"
          sx={{ fontWeight: 700, color: "inherit", textDecoration: "none" }}
        >
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Typography>
      </Container>
    </AppBar>
  );
}
