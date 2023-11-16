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
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "@mui/material/styles";

function TransactionSection({
  transactions,
  filterMonth,
  filterYear,
  handleDeleteSettings,
  handleEditButtonClick,
  transactionType,
}) {
  const theme = useTheme();

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
            ?.map((item) => (
              <TableRow
                key={item.settings_id}
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: theme.palette.text.main,
                  },
                  "&:nth-of-type(even)": {
                    backgroundColor: theme.palette.even.main,
                  },
                  borderRight: "1px solid",
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ borderRight: "1px solid", color: "black" }}
                >
                  {item.description}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ borderRight: "1px solid", color: "black" }}
                >
                  {item.amount} €
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleEditButtonClick(item.settings_id)}
                    style={{ color: "black" }}
                  >
                    <EditIcon />
                  </IconButton>
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
