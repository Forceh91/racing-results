import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Link from "next/link";
import { ItineraryEntry, ResultType } from "types";
import StyledTableRow, { numericColumn, sxBoldTableHeaders } from "lib/table";
import { convertLengthToKM } from "lib/circuit";

type EventResultsTableProps = {
  eventUUID: string;
  itinerary: ItineraryEntry[];
};

export const EventResultsTable = (props: EventResultsTableProps) => {
  const { eventUUID, itinerary: intinerary } = props;
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
            intinerary.map((itineraryEntry, ix) => (
              <>
                {isRally && intinerary[ix - 1]?.leg !== itineraryEntry.leg ? (
                  <TableRow key={`${itineraryEntry.uuid}-leg-identifier`}>
                    <TableCell colSpan={4} sx={{ fontWeight: 700 }}>
                      Leg {itineraryEntry.leg}
                    </TableCell>
                  </TableRow>
                ) : (
                  <></>
                )}
                <StyledTableRow key={itineraryEntry.uuid}>
                  <TableCell>{itineraryEntry.event_result_number}</TableCell>
                  <TableCell>{itineraryEntry.circuit.name}</TableCell>
                  <TableCell sx={numericColumn}>
                    {itineraryEntry.circuit.length ? `${convertLengthToKM(itineraryEntry.circuit.length)} km` : "-"}
                  </TableCell>
                  <TableCell>
                    {intinerary?.length ? (
                      <Link href={`/events/${eventUUID}/results/${itineraryEntry.uuid}`}>View Results</Link>
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
