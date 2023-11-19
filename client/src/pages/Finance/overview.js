/* Copyright (c) 2023, Jason Oltzen */

import { Box, Grid } from "@mui/material";
import { Container } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import EditTransactionDialog from "./edit";
import FilterTransactions from "./filter";
import TransactionsTable from "./table";

function FinanceOverview({ update }) {
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
      </Grid>
    </Container>
  );
}

export default FinanceOverview;
