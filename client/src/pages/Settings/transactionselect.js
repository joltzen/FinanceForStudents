import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StyledTableCell from "../../components/tablecell";

function TransactionSection({
  transactions,
  filterMonth,
  filterYear,
  handleDeleteSettings,
  transactionType,
}) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell text="Beschreibung" />
            <StyledTableCell text="Betrag" />
            <StyledTableCell text=" " />
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions
            .filter(
              (t) =>
                t?.transaction_type === transactionType &&
                t?.month === filterMonth &&
                t?.year === filterYear
            )
            .map((item) => (
              <TableRow
                key={item.settings_id}
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: "#e0e3e9",
                  },
                  "&:nth-of-type(even)": {
                    backgroundColor: "#D2D5DC",
                  },
                  borderRight: "1px solid",
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ borderRight: "1px solid" }}
                >
                  {item.description}
                </TableCell>
                <TableCell align="left" sx={{ borderRight: "1px solid" }}>
                  {item.amount} €
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleDeleteSettings(item.settings_id)}
                    style={{ color: "black" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TransactionSection;
