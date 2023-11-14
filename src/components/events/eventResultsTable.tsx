import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Link from "next/link";
import { EventResultIdentifiers } from "types";
import StyledTableRow, { numericColumn, sxBoldTableHeaders } from "lib/table";
import { convertLengthToKM } from "lib/circuit";

type EventResultsTableProps = {
  eventUUID: string;
  eventResults: EventResultIdentifiers;
};

export const EventResultsTable = (props: EventResultsTableProps) => {
  const { eventUUID, eventResults } = props;

  return (
    <TableContainer sx={{ marginTop: 2 }}>
      <Table stickyHeader>
        <TableHead sx={sxBoldTableHeaders}>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Location</TableCell>
            <TableCell sx={numericColumn}>Length</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {eventResults.length ? (
            eventResults.map((eventResult) => (
              <StyledTableRow key={eventResult.uuid}>
                <TableCell>{eventResult.event_result_number}</TableCell>
                <TableCell>{eventResult.circuit.name}</TableCell>
                <TableCell sx={numericColumn}>{convertLengthToKM(eventResult.circuit.length)} km</TableCell>
                <TableCell>
                  {eventResults?.length ? (
                    <Link href={`/events/${eventUUID}/results/${eventResult.uuid}`}>View Results</Link>
                  ) : (
                    <></>
                  )}
                </TableCell>
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow>
              <TableCell colSpan={3}>No results are available for this event yet</TableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
