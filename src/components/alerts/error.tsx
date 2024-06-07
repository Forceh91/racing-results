import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import { AlertProps } from ".";

export const ErrorBar = ({ shouldShow, text = "Something went wrong" }: AlertProps) =>
  shouldShow && (
    <Grid item xs={12}>
      <Alert variant="filled" severity="error">
        {text}
      </Alert>
    </Grid>
  );
