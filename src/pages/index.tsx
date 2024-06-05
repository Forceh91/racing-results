import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Typography from "@mui/material/Typography";
import { TextWithNationalityFlagSuffix } from "components/ui";
import { format, parseISO } from "date-fns";
import { useEventsOverviewQuery } from "hooks/useEventsOverview";
import Link from "next/link";
import { DEFAULT_DATE_FORMAT } from "../consts";
import StyledTableRow, { sxBoldTableHeaders } from "../lib/table";

export default function Home() {
  const { data, error, isLoading, isSuccess } = useEventsOverviewQuery();

  const formatDateRange = (startDate: string, endDate?: string) => {
    if (!endDate) return format(parseISO(startDate), DEFAULT_DATE_FORMAT);
    else
      return `${format(parseISO(startDate), DEFAULT_DATE_FORMAT)} - ${format(parseISO(endDate), DEFAULT_DATE_FORMAT)}`;
  };

  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12}>
        <Box sx={{ mb: 1 }}>
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
              <colgroup>
                <col width="275px" />
              </colgroup>
              <TableHead sx={sxBoldTableHeaders}>
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
                    <TableCell>{formatDateRange(event.start_date, event.end_date)}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {event.country && <TextWithNationalityFlagSuffix nationality={event.country} text={event.name} />}
                      {!event.country && <>{event.name}</>}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {event.has_itinerary ? <Link href={`/events/${event.uuid}/`}>View Event</Link> : <></>}
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
