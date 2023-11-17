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
  TablePagination,
  Grid,
} from "@mui/material";
import StyledTableCell from "../../components/tablecell";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TextComp from "../../components/TextComp";
import SelectComp from "../../components/SelectComp";
import { months, years } from "../../config/constants";
import { useTheme } from "@mui/material/styles";
import { Container } from "@mui/system";

function FinanceOverview({ update }) {
  const theme = useTheme();
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [transactions, setTransactions] = useState([]);
  const [totalSum, setTotalSum] = useState(0);
  const [savingSum, setSavingSum] = useState(0);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState([]);
  const { user } = useAuth();
  const [savingGoal, setSavingGoal] = useState([]);
  const [needUpdate, setNeedUpdate] = useState(false);

  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("de-DE", options);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          (filterYear === deadlineYear && filterMonth < deadlineMonth));

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
      setNeedUpdate(!needUpdate);
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
  }, [filterMonth, filterYear, totalSum, user.id, update, needUpdate]);

  const [editTransaction, setEditTransaction] = useState(null);
  const handleEditTransaction = async (transaction) => {
    try {
      await axiosInstance.patch("/updateTransaction", transaction);
      fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleEditButtonClick = (transaction) => {
    setEditTransaction(transaction);
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sx={{ mt: 4 }}>
          <FormControl>
            <InputLabel style={{ color: theme.palette.text.main }}>
              Monat
            </InputLabel>
            <SelectComp
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              label="Monat"
              sx={{
                color: theme.palette.text.main,
                backgroundColor: theme.palette.select.main,
                border: `1px solid ${theme.palette.text.main}`, // Use template literal for dynamic value
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
            <InputLabel style={{ color: theme.palette.text.main }}>
              Jahr
            </InputLabel>
            <SelectComp
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              label="Jahr"
              sx={{
                color: theme.palette.text.main,
                backgroundColor: theme.palette.select.main,
                border: `1px solid ${theme.palette.text.main}`, // Use template literal for dynamic value
              }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </SelectComp>
          </FormControl>
        </Grid>
        <Box sx={{ width: "100vw", marginTop: 4, marginBottom: 20 }}>
          <TableContainer
            component={Paper}
            sx={{ backgroundColor: theme.palette.pagination.main }}
          >
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
              <TableHead>
                <TableRow>
                  <StyledTableCell width="1px" text=" " />
                  <StyledTableCell width="20px" text="Datum" />
                  <StyledTableCell text="Beschreibung" />
                  <StyledTableCell width="100px" text="Betrag" />
                  <StyledTableCell width="100px" text=" " />
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((transaction) => {
                    const category = categories.find(
                      (c) => c.id === transaction.category_id
                    );
                    const categoryColor = category
                      ? category.color
                      : theme.palette.text.main;
                    return (
                      <TableRow
                        key={transaction.transaction_id}
                        sx={{
                          height: "10px",
                          backgroundColor: theme.palette.uneven.main,
                        }}
                      >
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
                            {transaction.transaction_type === "Ausgabe"
                              ? "-"
                              : "+"}
                          </Typography>
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{
                            border: "1px solid black",
                            color: "black",
                          }}
                        >
                          {formatDate(transaction.transaction_date)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid black",
                            color: "black",
                          }}
                        >
                          {transaction.description}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid black",
                            color: "black",
                          }}
                        >
                          {transaction.transaction_type === "Ausgabe"
                            ? "-"
                            : ""}
                          {transaction.amount} €
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            border: "1px solid black",
                            height: "1px",
                            color: "black",
                          }}
                        >
                          <IconButton
                            style={{ color: "black" }}
                            onClick={() => handleEditButtonClick(transaction)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleDeleteTransaction(
                                transaction.transaction_id
                              )
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
                display: "flex",
                justifyContent: "flex-end", // This will push the children to opposite ends
                alignItems: "center",
                width: "50vw",
                height: "50px",
                color: "black",
              }}
            >
              <Typography
                variant="body2"
                sx={{ marginRight: 2, color: "black" }}
              >
                Gesamtsumme: <strong>{savingSum.toFixed(2)}€</strong>
              </Typography>
            </Box>
          </TableContainer>
        </Box>

        {editTransaction && (
          <EditTransactionDialog
            transaction={editTransaction}
            onClose={() => setEditTransaction(null)}
            onSave={handleEditTransaction}
          />
        )}
      </Grid>
    </Container>
  );
}

function EditTransactionDialog({ transaction, onClose, onSave }) {
  const [editedTransaction, setEditedTransaction] = useState({
    ...transaction,
  });
  const theme = useTheme();
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
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.card.main,
          color: theme.palette.text.main,
        }}
      >
        Bearbeiten
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: theme.palette.card.main }}>
        <FormControl fullWidth>
          <InputLabel style={{ color: theme.palette.text.main }}>
            Transaktionstyp
          </InputLabel>
          <Select
            value={editedTransaction.transaction_type}
            onChange={handleSelectChange}
            label="Transaktionstyp"
            sx={{
              color: theme.palette.text.main,
              backgroundColor: theme.palette.select.main,
              border: `1px solid ${theme.palette.text.main}`, // Use template literal for dynamic value
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
      <DialogActions sx={{ backgroundColor: theme.palette.card.main }}>
        <Button onClick={onClose} sx={{ color: theme.palette.text.main }}>
          Abbrechen
        </Button>
        <Button onClick={handleSave} sx={{ color: theme.palette.text.main }}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FinanceOverview;
