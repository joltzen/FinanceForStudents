import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import {
  FormControl,
  InputLabel,
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
  Grid,
  Menu,
  Divider,
  TextField,
  Card,
  CardContent,
  InputAdornment,
  Select,
} from "@mui/material";
import { months, years } from "../../config/constants";
import { useTheme } from "@mui/material/styles";
import { Container } from "@mui/system";
import EditTransactionDialog from "./edit";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpward from "@mui/icons-material/ArrowUpward";

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
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortOrderAmount, setSortOrderAmount] = useState("desc");
  const [sortedByDateTransactions, setSortedByDateTransactions] = useState([]);
  const [sortedByAmountTransactions, setSortedByAmountTransactions] = useState(
    []
  );
  const [activeSorting, setActiveSorting] = useState("date"); // 'date' or 'amount'

  useEffect(() => {
    let sortedTransactions = [...transactions];
    if (activeSorting === "date") {
      sortedTransactions.sort((a, b) => {
        const dateA = new Date(a.transaction_date);
        const dateB = new Date(b.transaction_date);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
      setSortedByDateTransactions(sortedTransactions);
    } else if (activeSorting === "amount") {
      sortedTransactions.sort((a, b) => {
        const amountA = parseFloat(a.amount);
        const amountB = parseFloat(b.amount);

        const adjustedAmountA =
          a.transaction_type === "Ausgabe" ? -amountA : amountA;
        const adjustedAmountB =
          b.transaction_type === "Ausgabe" ? -amountB : amountB;

        return sortOrderAmount === "asc"
          ? adjustedAmountA - adjustedAmountB
          : adjustedAmountB - adjustedAmountA;
      });
      setSortedByAmountTransactions(sortedTransactions);
    }
  }, [
    sortOrder,
    sortOrderAmount,
    filterMonth,
    filterYear,
    totalSum,
    user.id,
    update,
    settings,
    needUpdate,
    activeSorting,
  ]);
  const toggleSortOrder = () => {
    setActiveSorting("date");
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const toggleSortOrderAmount = () => {
    setActiveSorting("amount");
    setSortOrderAmount(sortOrderAmount === "asc" ? "desc" : "asc");
  };

  // Use the correctly sorted array based on active sorting
  const displayedTransactions =
    activeSorting === "date"
      ? sortedByDateTransactions
      : sortedByAmountTransactions;

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("de-DE", options);
  }

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

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
  }, [
    filterMonth,
    filterYear,
    totalSum,
    settings,
    user.id,
    update,
    needUpdate,
  ]);

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
  }, [
    sortOrder,
    sortOrderAmount,
    filterMonth,
    filterYear,
    totalSum,
    user.id,
    update,
    needUpdate,
    activeSorting,
  ]);

  const [editTransaction, setEditTransaction] = useState(null);
  const handleEditTransaction = async (transaction) => {
    try {
      console.log(transaction);
      await axiosInstance.patch("/updateTransaction", transaction);
      fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleEditButtonClick = (transaction) => {
    setEditTransaction(transaction);
  };
  const finalTransactions = displayedTransactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchQuery);
    const matchesCategory = selectedCategory
      ? transaction.category_id === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sx={{ mt: 4 }}></Grid>
        <Box sx={{ width: "100vw", marginTop: 4, marginBottom: 20 }}>
          <Card
            sx={{
              marginBottom: theme.spacing(3),
              backgroundColor: theme.palette.card.main,
              color: theme.palette.secondary.main,
              borderRadius: "10px",
              boxShadow: theme.shadows[6],
              "&:hover": {
                boxShadow: theme.shadows[10],
              },
            }}
          >
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <InputLabel sx={{ marginBottom: 2 }}>Monat</InputLabel>
                  <FormControl
                    fullWidth
                    sx={{
                      marginBottom: 2,
                      backgroundColor: theme.palette.card.main,
                      height: "40px",
                    }}
                  >
                    <Select
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value)}
                      sx={{
                        color: theme.palette.text.main,
                        height: "40px",
                        ".MuiInputBase-input": {
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        },
                        border: `1px solid ${theme.palette.text.main}`,
                      }}
                    >
                      {months.map((month) => (
                        <MenuItem key={month.value} value={month.value}>
                          {month.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InputLabel sx={{ marginBottom: 2, marginLeft: 1 }}>
                    Jahr
                  </InputLabel>
                  <FormControl
                    fullWidth
                    sx={{
                      marginLeft: 1,
                      marginBottom: 2,
                      backgroundColor: theme.palette.card.main,
                      height: "40px",
                    }}
                  >
                    <Select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      sx={{
                        color: theme.palette.text.main,
                        height: "40px",
                        ".MuiInputBase-input": {
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        },
                        border: `1px solid ${theme.palette.text.main}`,
                      }}
                    >
                      {years.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <InputLabel sx={{ marginBottom: 2, marginLeft: 1 }}>
                    Filter nach Kategorie
                  </InputLabel>
                  <FormControl
                    fullWidth
                    sx={{
                      marginLeft: 1,
                      marginBottom: 2,
                      backgroundColor: selectedCategory
                        ? categories.find((c) => c.id === selectedCategory)
                            ?.color || theme.palette.content.main
                        : theme.palette.card.main,
                      height: "40px",
                    }}
                  >
                    <Select
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      displayEmpty // To allow display of 'None' even when value is empty
                      sx={{
                        color: selectedCategory
                          ? "black"
                          : theme.palette.text.main,
                        height: "40px",
                        ".MuiInputBase-input": {
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        },
                        border: `1px solid ${theme.palette.text.main}`,
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InputLabel sx={{ marginBottom: 2, marginLeft: 1 }}>
                    Suche
                  </InputLabel>

                  <TextField
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      sx: {
                        height: "40px",
                        ".MuiInputBase-input": {
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        },
                      },
                    }}
                    sx={{
                      ".MuiOutlinedInput-root": {
                        height: "40px",
                      },
                      marginLeft: 1,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
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
                            sortOrder === "asc"
                              ? "rotate(0deg)"
                              : "rotate(180deg)",
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
                          {transaction.transaction_type === "Ausgabe"
                            ? "-"
                            : "+"}
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
        </Box>

        {editTransaction && (
          <EditTransactionDialog
            transaction={editTransaction}
            onClose={() => setEditTransaction(null)}
            onSave={handleEditTransaction}
            categories={categories}
          />
        )}
      </Grid>
    </Container>
  );
}

function RowMenu({
  transaction,
  handleEditButtonClick,
  handleDeleteTransaction,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
      >
        <MoreHorizRoundedIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: "20ch",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleEditButtonClick(transaction);
            handleClose();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem onClick={handleClose}>Move</MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteTransaction} style={{ color: "red" }}>
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}
export default FinanceOverview;
