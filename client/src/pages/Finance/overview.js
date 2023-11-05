import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../core/auth/auth";
import {
  FormControl,
  InputLabel,
  Select,
  Box,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import StyledTableCell from "../../components/tablecell";

function FinanceOverview() {
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1); // JavaScript months are 0-indexed
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [transactions, setTransactions] = useState([]);
  const [totalSum, setTotalSum] = useState(0);

  const { user } = useAuth();

  const months = [
    { value: 1, label: "Januar" },
    { value: 2, label: "Februar" },
    { value: 3, label: "März" },
    { value: 4, label: "April" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Dezember" },
  ];

  const years = Array.from(
    { length: 10 },
    (_, index) => new Date().getFullYear() - index
  ); // Die letzten 10 Jahre
  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("de-DE", options);
  }

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/getUserTransactions",
        {
          params: {
            month: filterMonth,
            year: filterYear,
            user_id: user.id,
          },
        }
      );
      const sortedTransactions = response.data.sort((a, b) => {
        const dateA = new Date(a.transaction_date);
        const dateB = new Date(b.transaction_date);
        return dateA - dateB; // for ascending order use `dateA - dateB`
      });

      setTransactions(sortedTransactions);
      const total = sortedTransactions.reduce((acc, transaction) => {
        if (transaction.transaction_type === "Einnahme") {
          return acc + parseFloat(transaction.amount);
        } else if (transaction.transaction_type === "Ausgabe") {
          return acc - parseFloat(transaction.amount);
        }
        return acc;
      }, 0);

      setTotalSum(total);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterMonth, filterYear]);

  return (
    <div>
      <FormControl>
        <InputLabel style={{ color: "white" }}>Monat</InputLabel>
        <Select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          label="Monat"
          style={{ color: "white" }}
        >
          {months.map((month) => (
            <MenuItem key={month.value} value={month.value}>
              {month.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ marginLeft: 3, marginBottom: 2 }}>
        <InputLabel style={{ color: "white" }}>Jahr</InputLabel>
        <Select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          label="Monat"
          style={{ color: "white" }}
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="transaction table">
          <TableHead>
            <TableRow>
              <StyledTableCell text="Datum" />
              <StyledTableCell text="Beschreibung" />
              <StyledTableCell text="Betrag" />
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.transaction_id}>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ border: "1px solid black" }}
                >
                  {formatDate(transaction.transaction_date)}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {transaction.description}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {transaction.transaction_type === "Ausgabe" ? "-" : ""}
                  {transaction.amount}€
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
          <Typography variant="h6" sx={{ fontSize: 15, textAlign: "right" }}>
            Gesamtsumme: {totalSum.toFixed(2)}€
          </Typography>
        </Box>
      </TableContainer>
    </div>
  );
}

export default FinanceOverview;
