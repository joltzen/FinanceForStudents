/* Copyright (c) 2026, Jason Oltzen */

import { Alert, Grid, Snackbar } from "@mui/material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/system";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "../../core/auth/auth";
import {
  addFavorite,
  addTransaction,
  deleteTransaction,
  deleteFavoritesByTransaction,
  getCategories,
  getFavorites,
  getSavingGoals,
  getSettings,
  getTransactions,
  setTransactionFavorite,
  updateTransaction,
} from "../../services/db";
import { ColorModeContext } from "../../theme";
import DialogPage from "./card/dialog";
import FavCard from "./card/favcard";
import NavCard from "./card/navcards";
import SaveCard from "./card/sumcard";
import EditTransactionDialog from "./edit";
import FilterTransactions from "./filter";
import AddCategory from "./no_category";
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
    [],
  );
  const [activeSorting, setActiveSorting] = useState("date");
  const [isCategoryWarningOpen, setIsCategoryWarningOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [editTransaction, setEditTransaction] = useState(null);

  const fetchFavorites = useCallback(async () => {
    try {
      setFavorites(await getFavorites(user.id));
    } catch (error) {
      console.error("Fehler beim Abrufen der Favoriten:", error);
    }
  }, [user.id]);

  const fetchCategories = useCallback(async () => {
    try {
      setCategories(await getCategories(user.id));
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }, [user.id]);

  const handleAddTransaction = async () => {
    await fetchCategories();
    if (categories.length === 0) {
      setIsCategoryWarningOpen(true);
    } else {
      handleOpenDialog();
    }
  };

  const fetchTransactions = useCallback(async () => {
    try {
      const [txData, settingsData] = await Promise.all([
        getTransactions(user.id, filterMonth, filterYear),
        getSettings(user.id, filterMonth, filterYear),
      ]);
      const sorted = txData.sort(
        (a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime(),
      );
      setTransactions(sorted);
      setSettings(settingsData);
      const txSum = sorted.reduce(
        (acc, t) =>
          t.transaction_type === "Einnahme"
            ? acc + parseFloat(t.amount)
            : acc - parseFloat(t.amount),
        0,
      );
      const settingsSum = settingsData.reduce(
        (acc, s) =>
          s.transaction_type === "Einnahme"
            ? acc + parseFloat(s.amount)
            : acc - parseFloat(s.amount),
        0,
      );
      setTotalSum(txSum + settingsSum);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [filterMonth, filterYear, user.id, update, needUpdate]);

  useEffect(() => {
    let sorted = [...transactions];
    if (activeSorting === "date") {
      sorted.sort((a, b) =>
        sortOrder === "asc"
          ? new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()
          : new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime(),
      );
      setSortedByDateTransactions(sorted);
    } else {
      sorted.sort((a, b) => {
        const aA =
          a.transaction_type === "Ausgabe"
            ? -parseFloat(a.amount)
            : parseFloat(a.amount);
        const aB =
          b.transaction_type === "Ausgabe"
            ? -parseFloat(b.amount)
            : parseFloat(b.amount);
        return sortOrderAmount === "asc" ? aA - aB : aB - aA;
      });
      setSortedByAmountTransactions(sorted);
    }
    fetchFavorites();
  }, [
    sortOrder,
    sortOrderAmount,
    filterMonth,
    filterYear,
    totalSum,
    activeSorting,
    transactions,
    triggerUpdate,
  ]);

  useEffect(() => {
    const fetchAll = async () => {
      await fetchTransactions();
      await fetchCategories();
      try {
        setSavingGoal(await getSavingGoals(user.id));
      } catch (e) {
        console.error(e);
      }
    };
    fetchAll();
  }, [
    filterMonth,
    filterYear,
    totalSum,
    user.id,
    update,
    needUpdate,
    triggerUpdate,
    activeSorting,
  ]);

  useEffect(() => {
    let adjusted = totalSum;
    savingGoal.forEach((goal) => {
      const sMonth = new Date(goal.startdate).getMonth() + 1;
      const sYear = new Date(goal.startdate).getFullYear();
      const dMonth = new Date(goal.deadline).getMonth() + 1;
      const dYear = new Date(goal.deadline).getFullYear();
      const inRange =
        (filterYear > sYear ||
          (filterYear === sYear && filterMonth >= sMonth)) &&
        (filterYear < dYear || (filterYear === dYear && filterMonth < dMonth));
      if (inRange) adjusted -= goal.monthly_saving;
    });
    setSavingSum(adjusted);
  }, [totalSum, savingGoal, filterMonth, filterYear]);

  const displayedTransactions =
    activeSorting === "date"
      ? sortedByDateTransactions
      : sortedByAmountTransactions;

  const finalTransactions = displayedTransactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery);
    const matchesCategory = selectedCategory
      ? t.category_id === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await deleteTransaction(user.id, transactionId);
      setTransactions((prev) =>
        prev.filter((t) => t.transaction_id !== transactionId),
      );
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
    }
  };

  const handleEditTransaction = async (transaction) => {
    try {
      await updateTransaction(user.id, transaction.transaction_id, {
        amount: transaction.amount,
        description: transaction.description,
        transaction_date: transaction.transaction_date,
        transaction_type: transaction.transaction_type,
      });
      fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleAddFavorites = async (transaction) => {
    try {
      const newFav = await addFavorite(user.id, {
        transaction_type: transaction.transaction_type,
        description: transaction.description,
        amount: transaction.amount,
        category_id: transaction.category_id,
        transaction_id: transaction.transaction_id,
        is_own: false,
      });
      setFavorites((prev) => [...prev, newFav]);
      await setTransactionFavorite(user.id, transaction.transaction_id, true);
      setTransactions((prev) =>
        prev.map((t) =>
          t.transaction_id === transaction.transaction_id
            ? { ...t, favorites: true }
            : t,
        ),
      );
    } catch (error) {
      console.error("Favorites failed:", error);
    }
  };

  const handleDeleteFavorites = async (transaction) => {
    try {
      await deleteFavoritesByTransaction(user.id, transaction.transaction_id);
      setFavorites((prev) =>
        prev.filter((f) => f.transaction_id !== transaction.transaction_id),
      );
      await setTransactionFavorite(user.id, transaction.transaction_id, false);
      setTransactions((prev) =>
        prev.map((t) =>
          t.transaction_id === transaction.transaction_id
            ? { ...t, favorites: false }
            : t,
        ),
      );
    } catch (error) {
      console.error("Fehler beim Löschen der Favoriten:", error);
    }
  };

  const handleAddFavoriteToMonth = async (favorite, selectedDate) => {
    try {
      await addTransaction(user.id, {
        transaction_date: selectedDate,
        description: favorite.description,
        amount: favorite.amount,
        transaction_type: favorite.transaction_type,
        category_id: favorite.category_id,
        favorites: true,
      });
    } catch (error) {
      console.error("Error adding favorite to month:", error);
    }
  };

  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  const isDark = theme.palette.mode === "dark";
  const cardBg = isDark ? "#262b3d" : "#ffffff";

  return (
    <Grid container spacing={3} sx={{ p: { xs: 1, sm: 2 } }}>
      {/* Main content */}
      <Grid item xs={12} lg={8}>
        <Box
          sx={{
            backgroundColor: cardBg,
            borderRadius: 3,
            border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          }}
        >
          {/* Card header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              py: 2,
              borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{ color: theme.palette.text.main, fontWeight: 700 }}
              >
                Transaktionen
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.main, opacity: 0.4 }}
              >
                {finalTransactions.length} Einträge
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handleAddTransaction}
              sx={{
                backgroundColor: "#c6aa60",
                color: "#1a1e2e",
                fontWeight: 700,
                borderRadius: 2,
                px: 2.5,
                "&:hover": {
                  backgroundColor: "#b99a50",
                  boxShadow: "0 4px 12px rgba(198,170,96,0.35)",
                },
              }}
            >
              + Hinzufügen
            </Button>
          </Box>

          {/* Filters */}
          <FilterTransactions
            setFilterYear={setFilterYear}
            setFilterMonth={setFilterMonth}
            filterYear={filterYear}
            filterMonth={filterMonth}
            categories={categories}
            selectedCategory={selectedCategory}
            handleCategoryChange={(e) => setSelectedCategory(e.target.value)}
            searchQuery={searchQuery}
            handleSearchInputChange={(e) =>
              setSearchQuery(e.target.value.toLowerCase())
            }
          />

          {/* Table */}
          <Box sx={{ p: 2.5 }}>
            <TransactionsTable
              toggleSortOrder={() => {
                setActiveSorting("date");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
              toggleSortOrderAmount={() => {
                setActiveSorting("amount");
                setSortOrderAmount(sortOrderAmount === "asc" ? "desc" : "asc");
              }}
              sortOrder={sortOrder}
              sortOrderAmount={sortOrderAmount}
              finalTransactions={finalTransactions}
              categories={categories}
              savingSum={savingSum}
              handleEditButtonClick={(t) => setEditTransaction(t)}
              handleDeleteTransaction={handleDeleteTransaction}
              formatDate={formatDate}
              handleAddFavorites={handleAddFavorites}
              handleDeleteFavorites={handleDeleteFavorites}
              favorites={favorites}
            />
          </Box>
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

      {/* Sidebar */}
      <Grid item xs={12} lg={4}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <NavCard theme={theme} colorMode={colorMode} />
          </Grid>
          <Grid item>
            <SaveCard theme={theme} savingSum={savingSum} />
          </Grid>
          <Grid item>
            <FavCard
              theme={theme}
              favorites={favorites}
              categories={categories}
              handleAddFavoriteToMonth={handleAddFavoriteToMonth}
            />
          </Grid>
          <Grid item>
            <DialogPage onCategoryChange={triggerUpdate} />
          </Grid>
        </Grid>
      </Grid>

      <Dialog
        open={isCategoryWarningOpen}
        onClose={() => setIsCategoryWarningOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, backgroundColor: cardBg } }}
      >
        <DialogTitle sx={{ color: theme.palette.text.main, fontWeight: 700 }}>
          Kategorie erforderlich
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ color: theme.palette.text.main, opacity: 0.6 }}
          >
            Bitte lege zuerst mindestens eine Kategorie an.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setIsCategoryWarningOpen(false)}
            variant="outlined"
            sx={{
              borderColor: isDark
                ? "rgba(255,255,255,0.15)"
                : "rgba(0,0,0,0.15)",
              color: theme.palette.text.main,
              borderRadius: 2,
            }}
          >
            Abbrechen
          </Button>
          <AddCategory
            isCategoryWarningOpen={isCategoryWarningOpen}
            handleCategoryAdded={() => setIsCategoryWarningOpen(false)}
            onCategoryAdded={triggerUpdate}
          />
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default FinanceOverview;
