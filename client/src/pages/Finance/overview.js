import React, { useCallback, useEffect, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import StyledTableCell from "../../components/tablecell";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TextComp from "../../components/TextComp";
import SelectComp from "../../components/SelectComp";

function FinanceOverview() {
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
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ].map((label, index) => ({ value: index + 1, label }));

  const years = Array.from(
    { length: 10 },
    (_, index) => new Date().getFullYear() - index
  );
  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("de-DE", options);
  }

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/getTransactions", {
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
  });
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
  }, [
    filterMonth,
    filterYear,
    totalSum,
    user.id,
    savingGoal,
    calculateAdjustedTotalSum,
    fetchTransactions,
  ]);

  const [editTransaction, setEditTransaction] = useState(null);

  // Existing useEffect and other functions...

  const handleEditTransaction = async (transaction) => {
    // Implement the logic to update the transaction
    try {
      const response = await axiosInstance.patch(
        "/updateTransaction",
        transaction
      );
      // Handle the response
      fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleEditButtonClick = (transaction) => {
    setEditTransaction(transaction);
  };

  return (
    <div>
      <FormControl>
        <InputLabel style={{ color: "#e0e3e9" }}>Monat</InputLabel>
        <SelectComp
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
        </SelectComp>
      </FormControl>
      <FormControl sx={{ marginLeft: 3, marginBottom: 2 }}>
        <InputLabel style={{ color: "#e0e3e9" }}>Jahr</InputLabel>
        <SelectComp
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
        </SelectComp>
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
                  >
                    <IconButton
                      onClick={() => handleEditButtonClick(transaction)}
                    >
                      <EditIcon />
                    </IconButton>
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
      {editTransaction && (
        <EditTransactionDialog
          transaction={editTransaction}
          onClose={() => setEditTransaction(null)}
          onSave={handleEditTransaction}
        />
      )}
    </div>
  );
}

function EditTransactionDialog({ transaction, onClose, onSave }) {
  const [editedTransaction, setEditedTransaction] = useState({
    ...transaction,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTransaction({
      ...editedTransaction,
      [name]: value,
    });
  };

  // Updated handler specifically for the Select component
  const handleSelectChange = (event) => {
    setEditedTransaction({
      ...editedTransaction,
      transaction_type: event.target.value,
    });
  };

  const handleSave = () => {
    onSave(editedTransaction);
    onClose();
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = "0" + month;
    }
    if (day.length < 2) {
      day = "0" + day;
    }

    return [year, month, day].join("-");
  }
  return (
    <Dialog open={!!transaction} onClose={onClose}>
      <DialogTitle sx={{ backgroundColor: "#262b3d", color: "#e0e3e9" }}>
        Bearbeiten
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: "#262b3d" }}>
        <FormControl fullWidth>
          <InputLabel style={{ color: "#e0e3e9" }}>Transaktionstyp</InputLabel>
          <Select
            value={editedTransaction.transaction_type}
            onChange={handleSelectChange}
            label="Transaktionstyp"
            sx={{
              color: "#e0e3e9",
              backgroundColor: "#2e2e38",
              border: "1px solid #e0e3e9",
            }}
          >
            <MenuItem value="Ausgabe">Ausgabe</MenuItem>
            <MenuItem value="Einnahme">Einnahme</MenuItem>
          </Select>
        </FormControl>
        <TextComp
          label="Beschreibung"
          type="text"
          name="description"
          value={editedTransaction.description}
          onChange={handleInputChange}
          fullWidth
        />
        <TextComp
          label="Betrag"
          type="number"
          name="amount"
          value={editedTransaction.amount}
          onChange={handleInputChange}
          fullWidth
        />
        <TextComp
          fullWidth
          label="Datum"
          name="transaction_date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formatDate(editedTransaction.transaction_date)}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions sx={{ backgroundColor: "#262b3d" }}>
        <Button onClick={onClose} color="primary" sx={{ color: "#e0e3e9" }}>
          Abbrechen
        </Button>
        <Button onClick={handleSave} color="primary" sx={{ color: "#e0e3e9" }}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FinanceOverview;
