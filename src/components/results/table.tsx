import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { ResultEntry, ResultType } from "types";
import StyledTableRow, { numericColumn, sxBoldTableHeaders } from "lib/table";
import ResultDriverEntry from "components/resultdriverentry";
import { sortResults } from "lib/results";

type ResultsTableProps = {
  results: ResultEntry[];
  resultType: ResultType;
};

export const ResultsTable = (props: ResultsTableProps) => {
  const { results, resultType } = props;
  const isRally = resultType === ResultType.RALLY;
  const sortedResults = sortResults(results);
  const winner = sortedResults[0];

  return (
    <TableContainer sx={{ marginTop: 2 }}>
      <Table stickyHeader>
        <TableHead sx={sxBoldTableHeaders}>
          <TableRow>
            <TableCell sx={numericColumn}>Pos</TableCell>
            <TableCell>Driver</TableCell>
            <TableCell>Car/Team</TableCell>
            {!isRally && <TableCell sx={numericColumn}>Laps</TableCell>}
            <TableCell sx={numericColumn}>Time</TableCell>
            <TableCell sx={numericColumn}>Gap</TableCell>
            {!isRally && <TableCell sx={numericColumn}>Fastest Lap</TableCell>}
            {!isRally && <TableCell sx={numericColumn}>Grid</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedResults.map((result, ix) => (
            <StyledTableRow key={result.driver_uuid} sx={{ opacity: result.finished ? 1 : 0.6 }}>
              <ResultDriverEntry
                {...result}
                as={TableCell}
                winner={winner}
                {...(ix && { previousEntry: results[ix - 1] })}
                pos={ix + 1}
                isRally={isRally}
              />
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
