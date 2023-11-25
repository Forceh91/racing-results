import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Link from "next/link";
import { _EventResultIdentifiers, EventItinerary, ItineraryEntry, ResultType } from "types";
import StyledTableRow, { numericColumn, sxBoldTableHeaders } from "lib/table";
import { convertLengthToKM } from "lib/circuit";

type EventResultsTableProps = {
  eventUUID: string;
  intinerary: ItineraryEntry[];
};

export const EventResultsTable = (props: EventResultsTableProps) => {
  const { eventUUID, intinerary } = props;
  const isRally = intinerary.some((eventResult) => eventResult.type === ResultType.RALLY);

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
          {intinerary.length ? (
            intinerary.map((intineraryEntry, ix) => (
              <>
                {isRally && intinerary[ix - 1]?.leg !== intineraryEntry.leg ? (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ fontWeight: 700 }}>
                      Leg {intineraryEntry.leg}
                    </TableCell>
                  </TableRow>
                ) : (
                  <></>
                )}
                <StyledTableRow key={intineraryEntry.uuid}>
                  <TableCell>{intineraryEntry.event_result_number}</TableCell>
                  <TableCell>{intineraryEntry.circuit.name}</TableCell>
                  <TableCell sx={numericColumn}>
                    {intineraryEntry.circuit.length ? `${convertLengthToKM(intineraryEntry.circuit.length)} km` : "-"}
                  </TableCell>
                  <TableCell>
                    {intinerary?.length ? (
                      <Link href={`/events/${eventUUID}/results/${intineraryEntry.uuid}`}>View Results</Link>
                    ) : (
                      <></>
                    )}
                  </TableCell>
                </StyledTableRow>
              </>
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
