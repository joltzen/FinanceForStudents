/* Copyright (c) 2023, Jason Oltzen */

import ArrowUpward from "@mui/icons-material/ArrowUpward";
import {
  Box,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Select,
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
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10); // Default rows per page

  const transactionsPerPage = 10; // Adjust as needed
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleChangeRowsPerPage = (event) => {
    const value = event.target.value;
    setRowsPerPage(
      value === "all" ? finalTransactions.length : parseInt(value, 10)
    );
    setPage(1); // Reset page to 1 after changing the number of rows
  };
  const pageCount = Math.ceil(finalTransactions.length / rowsPerPage);
  const displayedTransactions = finalTransactions.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
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
          {displayedTransactions.map((transaction) => {
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
          alignItems: "center",
          padding: 2,
        }}
      >
        {/* Select field Box */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            width: "33%", // takes up 1/3 of the space
          }}
        >
          <Typography sx={{ marginTop: 1 }}>Rows per page</Typography>
          <Select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            displayEmpty
            variant="standard"
            sx={{
              height: "40px",
              ".MuiInputBase-input": {
                paddingTop: "5px",
                paddingBottom: "5px",
              },
              border: "none",
              marginLeft: 3,
            }}
          >
            {[5, 10, 15, 20].map((rows) => (
              <MenuItem key={rows} value={rows}>
                {rows}
              </MenuItem>
            ))}
            <MenuItem key="all" value="all">
              Alle
            </MenuItem>
          </Select>
        </Box>

        {/* Pagination Box */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "33%", // takes up 1/3 of the space
          }}
        >
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{
              ".Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
              },
              ".MuiPaginationItem-ellipsis": {
                color: theme.palette.text.primary,
              },
            }}
          />
        </Box>

        {/* Typography Box */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "33%", // takes up 1/3 of the space
          }}
        >
          <Typography variant="body2" sx={{ color: theme.palette.text.main }}>
            Gesamtsumme: <strong>{savingSum.toFixed(2)}€</strong>
          </Typography>
        </Box>
      </Box>
    </TableContainer>
  );
}

export default TransactionsTable;
