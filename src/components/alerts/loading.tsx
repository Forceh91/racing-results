import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import { AlertProps } from ".";

export const LoadingBar = ({ shouldShow, text = "Loading..." }: AlertProps) =>
  shouldShow && (
    <Grid item xs={12}>
      <Alert variant="filled" severity="info">
        {text}
      </Alert>
    </Grid>
  );
