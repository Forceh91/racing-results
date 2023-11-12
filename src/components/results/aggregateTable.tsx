import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { AggregatedResultEntry } from "types";
import StyledTableRow, { numericColumn, sxBoldTableHeaders } from "lib/table";
import { sortAggregatedResults } from "lib/results";
import AggregatedResultDriverEntry from "components/aggregatedresultdriverentry";

type AggregateResultsTableProps = {
  results: AggregatedResultEntry[];
};

export const AggregateResultsTable = (props: AggregateResultsTableProps) => {
  const { results } = props;
  const sortedResults = sortAggregatedResults(results);

  return (
    <TableContainer sx={{ marginTop: 2 }}>
      <Table stickyHeader>
        <TableHead sx={sxBoldTableHeaders}>
          <TableRow>
            <TableCell sx={numericColumn}>Pos</TableCell>
            <TableCell>Driver</TableCell>
            <TableCell>Car/Team</TableCell>
            <TableCell sx={numericColumn}>Time</TableCell>
            <TableCell sx={numericColumn}>Gap</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedResults.map((result, ix) => (
            <StyledTableRow key={result.driver_uuid}>
              <AggregatedResultDriverEntry
                {...result}
                as={TableCell}
                winner={results[0]}
                {...(ix && { previousEntry: results[ix - 1] })}
                pos={ix + 1}
              />
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
