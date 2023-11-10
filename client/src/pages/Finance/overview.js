import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
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
  IconButton,
} from "@mui/material";
import StyledTableCell from "../../components/tablecell";
import DeleteIcon from "@mui/icons-material/Delete";

function FinanceOverview() {
  const today = new Date().toISOString().split("T")[0];

  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [transactions, setTransactions] = useState([]);
  const [totalSum, setTotalSum] = useState(0);
  const [savingSum, setSavingSum] = useState(0);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState([]);
  const { user } = useAuth();
  const [savingGoal, setSavingGoal] = useState([]);
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
  );
  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("de-DE", options);
  }

  const fetchTransactions = async () => {
    try {
      const response = await axiosInstance.get("/getUserTransactions", {
        params: {
          month: filterMonth,
          year: filterYear,
          user_id: user.id,
        },
      });

      const res = await axiosInstance.get("/getSettings", {
        params: {
          month: filterMonth,
          year: filterYear,
          user_id: user.id,
        },
      });

      const sortedTransactions = response.data.sort((a, b) => {
        const dateA = new Date(a.transaction_date);
        const dateB = new Date(b.transaction_date);
        return dateA - dateB;
      });

      setTransactions(sortedTransactions);
      setSettings(res.data);
      const t = sortedTransactions.reduce((acc, transaction) => {
        if (transaction.transaction_type === "Einnahme") {
          return acc + parseFloat(transaction.amount);
        } else if (transaction.transaction_type === "Ausgabe") {
          return acc - parseFloat(transaction.amount);
        }
        return acc;
      }, 0);
      const total =
        t +
        settings.reduce((acc, setting) => {
          if (setting.transaction_type === "Einnahme") {
            return acc + parseFloat(setting.amount);
          } else if (setting.transaction_type === "Ausgabe") {
            return acc - parseFloat(setting.amount);
          }
          return acc;
        }, 0);
      setTotalSum(total);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };
  function calculateAdjustedTotalSum() {
    let adjustedTotal = totalSum;

    savingGoal.forEach((goal) => {
      const startMonth = new Date(goal.startdate).getMonth() + 1;
      const startYear = new Date(goal.startdate).getFullYear();
      const deadlineMonth = new Date(goal.deadline).getMonth() + 1;
      const deadlineYear = new Date(goal.deadline).getFullYear();

      const isWithinRange =
        (filterYear > startYear ||
          (filterYear === startYear && filterMonth >= startMonth)) &&
        (filterYear < deadlineYear ||
          (filterYear === deadlineYear && filterMonth <= deadlineMonth));

      if (isWithinRange) {
        adjustedTotal -= goal.monthly_saving;
      }
    });

    setSavingSum(adjustedTotal);
  }
  const handleDeleteTransaction = async (transactionId) => {
    try {
      await axiosInstance.delete("/deleteTransaction", {
        params: { id: transactionId },
      });
      setTransactions((prevTransactions) =>
        prevTransactions.filter(
          (transaction) => transaction.transaction_id !== transactionId
        )
      );
    } catch (error) {
      console.error("Fehler beim Löschen der Transaktion:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/getCategories", {
          params: { user_id: user.id },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Kategorien:", error);
      }
    };

    fetchCategories();
    const fetchGoals = async () => {
      try {
        const response = await axiosInstance.get("/get-saving-goals", {
          params: { userId: user.id },
        });
        setSavingGoal(response.data);
      } catch (error) {
        console.error("Fehler beim Abrufen der Sparziele", error);
      }
    };

    fetchGoals();
    calculateAdjustedTotalSum();
  }, [filterMonth, filterYear, totalSum]);

  return (
    <div>
      <FormControl>
        <InputLabel style={{ color: "#e0e3e9" }}>Monat</InputLabel>
        <Select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          label="Monat"
          sx={{
            color: "#e0e3e9",
            backgroundColor: "#2e2e38",
            border: "1px solid #e0e3e9",
          }}
        >
          {months.map((month) => (
            <MenuItem key={month.value} value={month.value}>
              {month.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ marginLeft: 3, marginBottom: 2 }}>
        <InputLabel style={{ color: "#e0e3e9" }}>Jahr</InputLabel>
        <Select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          label="Jahr"
          sx={{
            color: "#e0e3e9",
            backgroundColor: "#2e2e38",
            border: "1px solid #e0e3e9",
          }}
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
              <StyledTableCell text=" " />
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => {
              const category = categories.find(
                (c) => c.id === transaction.category_id
              );
              const categoryColor = category ? category.color : "#e0e3e9";
              return (
                <TableRow key={transaction.transaction_id}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      border: "1px solid black",
                      backgroundColor: categoryColor,
                    }}
                  >
                    {formatDate(transaction.transaction_date)}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      backgroundColor: categoryColor,
                    }}
                  >
                    {transaction.description}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      backgroundColor: categoryColor,
                    }}
                  >
                    {transaction.transaction_type === "Ausgabe" ? "-" : ""}
                    {transaction.amount} €
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      border: "1px solid black",
                      backgroundColor: categoryColor,
                    }}
                    s
                  >
                    <IconButton
                      onClick={() =>
                        handleDeleteTransaction(transaction.transaction_id)
                      }
                      style={{ color: "black" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Box
          sx={{
            p: 1,
            display: "flex",
            justifyContent: "flex-end",
            backgroundColor: "#e0e3e9",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: 15,
              textAlign: "right",
              fontWeight: "bold",
            }}
          >
            Gesamtsumme: {savingSum.toFixed(2)}€
          </Typography>
        </Box>
      </TableContainer>
    </div>
  );
}

export default FinanceOverview;
