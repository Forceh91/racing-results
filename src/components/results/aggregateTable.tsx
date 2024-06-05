import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";

import { AggregatedResultEntry } from "types";
import StyledTableRow, { numericColumn, sxBoldTableHeaders } from "lib/table";
import { sortAggregatedResults } from "lib/results";
import AggregatedResultDriverEntry from "components/aggregatedresultdriverentry";
import RetirementEntry from "components/retirement/retirementEntry";

type AggregateResultsTableProps = {
  results: AggregatedResultEntry[];
  retirements?: AggregatedResultEntry[];
};

export const AggregateResultsTable = (props: AggregateResultsTableProps) => {
  const { results, retirements } = props;
  const sortedResults = sortAggregatedResults(results);

  return (
    <>
      <TableContainer sx={{ marginTop: 2 }}>
        <Table stickyHeader>
          <colgroup>
            <col width="65px" />
          </colgroup>
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

      {retirements?.length ? (
        <>
          <Typography variant="h3" sx={{ marginTop: 2 }}>
            Retirements
          </Typography>
          <TableContainer sx={{ marginTop: 2 }}>
            <Table stickyHeader>
              <TableHead sx={sxBoldTableHeaders}>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Driver</TableCell>
                  <TableCell>Car/Team</TableCell>
                  <TableCell>Reason</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {retirements.map((retirement) => (
                  <StyledTableRow key={retirement.driver_uuid}>
                    <RetirementEntry {...retirement} as={TableCell} isRally />
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
