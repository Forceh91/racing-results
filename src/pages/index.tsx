import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Link from "next/link";
import { useEventsOverview } from "hooks/useEventsOverview";
import { format, parseISO } from "date-fns";
import { DEFAULT_DATE_FORMAT } from "../consts";
import StyledTableRow from "../components/styledtablerow";

export default function Home() {
  const { data, error, isLoading, isSuccess } = useEventsOverview();

  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12}>
        <Box sx={{ my: 1 }}>
          <Typography variant="h1">{process.env.NEXT_PUBLIC_APP_NAME}</Typography>

          <Typography variant="h2" sx={{ marginTop: 2 }}>
            Latest Events
          </Typography>
        </Box>

        {error && (
          <Alert variant="filled" severity="error">
            Unable to fetch latest events...
          </Alert>
        )}

        {isLoading && (
          <Alert variant="filled" severity="info">
            Fetching latest events...
          </Alert>
        )}

        {isSuccess && (
          <TableContainer sx={{ marginTop: 2 }}>
            <Table stickyHeader>
              <TableHead>
                <StyledTableRow>
                  <TableCell>Event Date</TableCell>
                  <TableCell>Event Name</TableCell>
                  <TableCell></TableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {!data.length && (
                  <StyledTableRow>
                    <TableCell colSpan={3}>There are no recent events</TableCell>
                  </StyledTableRow>
                )}
                {data.map((event) => (
                  <StyledTableRow key={event.uuid}>
                    <TableCell>{format(parseISO(event.start_date), DEFAULT_DATE_FORMAT)}</TableCell>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>
                      {event.results?.length && <Link href={`/events/${event.uuid}/`}>View Event</Link>}
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>
    </Grid>
  );
}
