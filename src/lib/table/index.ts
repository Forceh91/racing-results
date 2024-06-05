import { SxProps, styled } from "@mui/material";
import TableRow from "@mui/material/TableRow";

export const numericColumn: SxProps = { textAlign: "right" };

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default StyledTableRow;

export const sxSubData: SxProps = { fontSize: ".85em", color: "gray" };

export const sxBoldTableHeaders: SxProps = { th: { fontWeight: "bold" } };
