import ArrowUpward from "@mui/icons-material/ArrowUpward";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import RowMenu from "./rowmenu";
function TransactionsTable({
  toggleSortOrder,
  toggleSortOrderAmount,
  sortOrder,
  sortOrderAmount,
  finalTransactions,
  categories,
  savingSum,
  handleEditButtonClick,
  handleDeleteTransaction,
  formatDate,
}) {
  const theme = useTheme();
  return (
    <TableContainer component={Paper} elevation={10}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead
          sx={{
            backgroundColor: theme.palette.head.main,
          }}
        >
          <TableRow>
            <TableCell sx={{ width: "1px" }}></TableCell>
            <TableCell
              sx={{ width: "20px", color: theme.palette.tabletext.main }}
            >
              Datum
              <IconButton
                onClick={toggleSortOrder}
                sx={{ color: theme.palette.tabletext.main }}
              >
                <ArrowUpward
                  sx={{
                    transform:
                      sortOrder === "asc" ? "rotate(0deg)" : "rotate(180deg)",
                  }}
                />
              </IconButton>
            </TableCell>
            <TableCell sx={{ color: theme.palette.tabletext.main }}>
              Beschreibung
            </TableCell>
            <TableCell
              align="right"
              sx={{ width: "100px", color: theme.palette.tabletext.main }}
            >
              Betrag
              <IconButton
                onClick={toggleSortOrderAmount}
                sx={{ color: theme.palette.tabletext.main }}
              >
                <ArrowUpward
                  sx={{
                    transform:
                      sortOrderAmount === "asc"
                        ? "rotate(0deg)"
                        : "rotate(180deg)",
                  }}
                />
              </IconButton>
            </TableCell>
            <TableCell sx={{ width: "1px" }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ backgroundColor: theme.palette.content.main }}>
          {finalTransactions.map((transaction) => {
            const category = categories.find(
              (c) => c.id === transaction.category_id
            );
            const categoryColor = category
              ? category.color
              : theme.palette.text.main;
            return (
              <TableRow key={transaction.transaction_id}>
                <TableCell
                  sx={{
                    borderLeft: `10px solid ${categoryColor}`,
                    height: "10px", // Reduce height
                    color:
                      transaction.transaction_type === "Ausgabe"
                        ? "red"
                        : "green",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontSize={
                      transaction.transaction_type === "Ausgabe"
                        ? "23px"
                        : "19px"
                    }
                  >
                    {transaction.transaction_type === "Ausgabe" ? "-" : "+"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ marginRight: "50px" }}>
                    {formatDate(transaction.transaction_date)}
                  </Box>
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell align="right">
                  {transaction.transaction_type === "Ausgabe" ? "-" : ""}
                  {transaction.amount} €
                </TableCell>
                <TableCell align="right">
                  <RowMenu
                    transaction={transaction}
                    handleEditButtonClick={handleEditButtonClick}
                    handleDeleteTransaction={() =>
                      handleDeleteTransaction(transaction.transaction_id)
                    }
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end", // This will push the children to opposite ends
          alignItems: "center",
          padding: 2,
          color: theme.palette.text.main,
        }}
      >
        <Typography
          variant="body2"
          sx={{ marginRight: 2, color: theme.palette.text.main }}
        >
          Gesamtsumme: <strong>{savingSum.toFixed(2)}€</strong>
        </Typography>
      </Box>
    </TableContainer>
  );
}

export default TransactionsTable;
