import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export default function Home() {
  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12}>
        <Typography variant="h1">{process.env.NEXT_PUBLIC_APP_NAME}</Typography>
      </Grid>
    </Grid>
  );
}
