/* Copyright (c) 2023, Jason Oltzen */

import Add from "@mui/icons-material/Add";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BarChartIcon from "@mui/icons-material/BarChart";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import SavingsIcon from "@mui/icons-material/Savings";
import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/system";
import React, { useCallback, useContext, useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import { ColorModeContext } from "../../theme";
import AddCategory from "./addcategory";
import DialogPage from "./dialog";
import EditTransactionDialog from "./edit";
import AddFavorites from "./favoritesdialog";
import FilterTransactions from "./filter";
import TransactionsTable from "./table";
function FinanceOverview({ update, handleOpenDialog, triggerUpdate }) {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortOrderAmount, setSortOrderAmount] = useState("desc");
  const [sortedByDateTransactions, setSortedByDateTransactions] = useState([]);
  const [sortedByAmountTransactions, setSortedByAmountTransactions] = useState(
    []
  );
  const [activeSorting, setActiveSorting] = useState("date");
  const [isCategoryWarningOpen, setIsCategoryWarningOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const fetchFavorites = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/getFavorites", {
        params: { user_id: user.id },
      });
      setFavorites(response.data);
    } catch (error) {
      console.error("Fehler beim Abrufen der Favoriten:", error);
    }
  }, [user.id]);

  const handleAddTransaction = () => {
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
    console.log(categories.length);
    if (categories.length === 0) {
      setIsCategoryWarningOpen(true); // Öffnet den Dialog
    } else {
      handleOpenDialog(); // Fährt fort mit dem Hinzufügen einer Transaktion
    }
  };

  const handleCategoryAdded = () => {
    setIsCategoryWarningOpen(false);
  };

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
    fetchFavorites();
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
    triggerUpdate,
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
    fetchTransactions,
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

  const handleAddFavorites = async (transaction) => {
    try {
      const response = await axiosInstance.post("/addFavorites", {
        user_id: transaction.user_id,
        transactionType: transaction.transaction_type,
        description: transaction.description,
        amount: transaction.amount,
        category_id: transaction.category_id,
        transaction_id: transaction.transaction_id,
        isOwn: false,
      });
      setFavorites((prevFavorites) => [...prevFavorites, response.data]);
    } catch (error) {
      console.error("Favorites failed:", error);
    }
    try {
      await axiosInstance.patch("/setTransactionFavorite", {
        transaction_id: transaction.transaction_id,
        isFavorite: true,
      });
    } catch (error) {
      console.error("Favorites failed:", error);
    }
  };

  const handleDeleteFavorites = async (transaction) => {
    try {
      await axiosInstance.delete("/deleteFavoritesByTransaction", {
        params: { id: transaction.transaction_id },
      });
      setFavorites(
        favorites.filter(
          (fav) => fav.transaction_id !== transaction.transaction_id
        )
      );
    } catch (error) {
      console.error("Fehler beim Löschen der Favoriten:", error);
    }
    try {
      await axiosInstance.patch("/setTransactionFavorite", {
        transaction_id: transaction.transaction_id,
        isFavorite: false,
      });
    } catch (error) {
      console.error("Favorites failed:", error);
    }
  };

  const handleAddFavoriteToMonth = async (favorite) => {
    const currentDate = new Date().toISOString().slice(0, 10);
    try {
      const newTransaction = {
        date: currentDate,
        description: favorite.description,
        amount: favorite.amount,
        transactionType: favorite.transaction_type,
        user_id: user.id,
        category_id: favorite.category_id,
        isFavorite: true,
      };
      await axiosInstance.post("/addTransaction", newTransaction);
    } catch (error) {
      console.error("Error adding favorite to month:", error);
    }
  };

  const theme = useTheme();
  const colorMode = useContext(ColorModeContext); // Access the color mode context

  return (
    <Grid container spacing={4} style={{ minHeight: "100vh" }}>
      <Grid item xs={12} sm={8} md={6} lg={8} style={{ minHeight: "100%" }}>
        <Card
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: theme.palette.left.main,
          }}
        >
          <CardContent
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 10,
              height: "100%",
            }}
          >
            <Box component="form" noValidate sx={{ mt: 4, width: "100%" }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 2, mb: 4, width: "100%" }}
              >
                <Typography variant="h4" color={theme.palette.text.main}>
                  Übersicht
                </Typography>

                <IconButton
                  variant="contained"
                  onClick={handleAddTransaction}
                  sx={{
                    backgroundColor: theme.palette.primary.main,

                    boxShadow: 5,
                  }}
                >
                  <Tooltip
                    sx={{ color: theme.palette.text.main }}
                    title="Transaktion hinzufügen"
                  >
                    <Add sx={{ color: theme.palette.common.white }} />
                  </Tooltip>
                </IconButton>
              </Box>

              <FilterTransactions
                transactions={transactions}
                setTransactions={transactions}
                setFilterYear={setFilterYear}
                setFilterMonth={setFilterMonth}
                filterYear={filterYear}
                filterMonth={filterMonth}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                handleCategoryChange={handleCategoryChange}
                searchQuery={searchQuery}
                handleSearchInputChange={handleSearchInputChange}
              />
              <TransactionsTable
                toggleSortOrder={toggleSortOrder}
                toggleSortOrderAmount={toggleSortOrderAmount}
                sortOrder={sortOrder}
                sortOrderAmount={sortOrderAmount}
                finalTransactions={finalTransactions}
                categories={categories}
                savingSum={savingSum}
                handleEditButtonClick={handleEditButtonClick}
                handleDeleteTransaction={handleDeleteTransaction}
                formatDate={formatDate}
                handleAddFavorites={handleAddFavorites}
                handleDeleteFavorites={handleDeleteFavorites}
                favorites={favorites}
              />
            </Box>

            {editTransaction && (
              <EditTransactionDialog
                transaction={editTransaction}
                onClose={() => setEditTransaction(null)}
                onSave={handleEditTransaction}
                categories={categories}
              />
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4} style={{ minHeight: "100%" }}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Card
              sx={{
                backgroundColor: theme.palette.card.main,
                boxShadow: theme.shadows[6],
                "&:hover": {
                  boxShadow: theme.shadows[10],
                },
                height: "100%",
                marginRight: 4,
                minHeight: "100px",
                marginTop: 2,
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Box
                    sx={{
                      backgroundColor: theme.palette.error.main,
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      marginRight: 5,
                      marginLeft: 5,
                      top: theme.spacing(2),
                      right: theme.spacing(2),
                    }}
                  >
                    <Tooltip title="Fixkosten verwalten" placement="left">
                      <IconButton href="/fixed">
                        <AttachMoneyIcon
                          sx={{ color: theme.palette.common.white }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: theme.palette.favorites.main,
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      marginRight: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      top: theme.spacing(2),
                      right: theme.spacing(2),
                    }}
                  >
                    <Tooltip title="Favoriten" placement="left">
                      <IconButton href="/favorites">
                        <StarIcon sx={{ color: theme.palette.common.white }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: theme.palette.total.main,
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      marginRight: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      top: theme.spacing(2),
                      right: theme.spacing(2),
                    }}
                  >
                    <Tooltip title="Dashboard" placement="left">
                      <IconButton href="/">
                        <BarChartIcon
                          sx={{ color: theme.palette.common.white }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: theme.palette.task.main,
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      marginRight: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      top: theme.spacing(2),
                      right: theme.spacing(2),
                    }}
                  >
                    <Tooltip title="Sparziele" placement="left">
                      <IconButton href="/saving">
                        <SavingsIcon
                          sx={{ color: theme.palette.common.white }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: theme.palette.left.main,
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      top: theme.spacing(2),
                      right: theme.spacing(2),
                    }}
                  >
                    <Tooltip title="Colormodus" placement="left">
                      {colorMode.mode}
                      <IconButton
                        onClick={colorMode.toggleColorMode}
                        color="inherit"
                      >
                        {theme.palette.mode === "dark" ? (
                          <DarkModeOutlinedIcon sx={{ color: "white" }} />
                        ) : (
                          <LightModeOutlinedIcon sx={{ color: "black" }} />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card
              sx={{
                backgroundColor: theme.palette.card.main,
                boxShadow: theme.shadows[6],
                "&:hover": {
                  boxShadow: theme.shadows[10],
                },
                height: "100%",
                marginRight: 4,
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ color: theme.palette.text.main }}
                    >
                      <strong>Gesamtausgaben diesen Monat:</strong>
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2 }}>
                      {savingSum.toFixed(2)} €
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card
              sx={{
                backgroundColor: theme.palette.card.main,
                boxShadow: theme.shadows[6],
                "&:hover": {
                  boxShadow: theme.shadows[10],
                },
                height: "100%",
                marginTop: 2,
                marginRight: 4,
              }}
            >
              <CardContent>
                {favorites.length === 0 ? (
                  <>
                    <Typography variant="h6">Favoriten </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Du hast derzeit noch keine Favoriten. Klicke auf den
                      Button um neue Favoriten hinzuzufügen.
                    </Typography>
                    <Typography variant="body1">
                      Mithilfe der Favoriten kannst du deine regelmäßigen
                      Einnahmen und Ausgaben schneller hinzufügen.
                    </Typography>
                    <Button
                      variant="contained"
                      href="/favorites"
                      sx={{ mt: 4 }}
                    >
                      Favoriten hinzufügen
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                      Favoriten
                    </Typography>
                    {favorites?.map((favorite, index) => {
                      const category = categories.find(
                        (cat) => cat.id === favorite.category_id
                      );
                      const categoryColor = category ? category.color : "#ccc"; // Default color if not found

                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: 2,
                            marginBottom: 1,
                            backgroundColor: theme.palette.favlist.main,
                            borderRadius: theme.shape.borderRadius,
                            boxShadow: theme.shadows[1],
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{
                                width: "15px",
                                height: "15px",
                                borderRadius: "50%",
                                backgroundColor: categoryColor,
                                marginRight: 2,
                              }}
                            />
                            <Typography variant="body1">
                              <strong>{favorite.description} </strong>
                              <strong>{favorite.amount} €</strong>
                            </Typography>
                          </Box>
                          {/* <IconButton
                            onClick={() =>
                              handleDeleteFavoritesById(favorite.favorites_id)
                            }
                            color="secondary"
                          >
                            <DeleteIcon />
                          </IconButton> */}
                          <IconButton
                            onClick={() => handleAddFavoriteToMonth(favorite)}
                            color="primary"
                            aria-label="add to month"
                          >
                            <Add sx={{ color: theme.palette.text.main }} />
                          </IconButton>
                        </Box>
                      );
                    })}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card
              sx={{
                backgroundColor: theme.palette.card.main,
                boxShadow: theme.shadows[6],
                "&:hover": {
                  boxShadow: theme.shadows[10],
                },
                height: "100%",
                marginTop: 2,
                marginRight: 4,
                marginBottom: 5,
              }}
            >
              <CardContent>
                <DialogPage onCategoryChange={triggerUpdate} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={isCategoryWarningOpen}
        onClose={() => setIsCategoryWarningOpen(false)}
        aria-labelledby="category-warning-dialog-title"
      >
        <DialogTitle id="category-warning-dialog-title">
          Kategorie erforderlich
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bitte legen Sie zuerst mindestens eine Kategorie an.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsCategoryWarningOpen(false)}
            variant="contained"
          >
            Abbrechen
          </Button>
          <AddCategory
            setCategoryWarningOpen={isCategoryWarningOpen}
            handleCategoryAdded={handleCategoryAdded}
            onCategoryAdded={triggerUpdate}
          />
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default FinanceOverview;
