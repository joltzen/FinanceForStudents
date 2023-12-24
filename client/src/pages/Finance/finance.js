/* Copyright (c) 2023, Jason Oltzen */

import { Alert, Grid, Snackbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import AddTransaction from "./addtransaction";
import FilterTransactions from "./filter";
import FinanceOverview from "./overview";
function FinancePage() {
  const today = new Date().toISOString().split("T")[0];
  const theme = useTheme();
  const { user } = useAuth();

  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("Ausgabe");
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [update, setUpdate] = useState(false);
  const [updateNeeded, setUpdateNeeded] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const triggerUpdate = () => {
    setUpdateNeeded((prev) => !prev);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setUpdate(!update);
    setOpenDialog(false);
  };
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleTransactionTypeChange = (e) => {
    setTransactionType(e.target.value);
  };

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    try {
      const response = await axiosInstance.post("/addTransaction", {
        date,
        description,
        amount,
        transactionType,
        user_id: user.id,
        category_id: category,
        isFavorite: false,
      });
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        response.data.transaction,
      ]);
      setAmount("");
      setDescription("");
      setDate(date);
      setTransactionType("Ausgabe");
      setCategory(category);
      setSnackbarMessage("Transaktion erfolgreich hinzugefügt!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Transaction failed:", error);
      setSnackbarMessage("Fehler beim hinzufügen der Transaktion!");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/getCategories", {
          params: { user_id: user.id },
        });
        setCategories(response.data);
        if (response.data.length > 0) {
          setCategory(response.data[0].id);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Kategorien:", error);
      }
    };
    fetchCategories();
    const fetchFavorites = async () => {
      try {
        const response = await axiosInstance.get("/getFavorites", {
          params: { user_id: user.id },
        });
        setFavorites(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Favoriten:", error);
      }
    };
    fetchFavorites();
  }, [user.id, update, updateNeeded]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <Grid item xs={12} md={8} lg={6}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <AddTransaction
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        theme={theme}
        handleSubmit={handleSubmit}
        description={description}
        handleDescriptionChange={handleDescriptionChange}
        amount={amount}
        handleAmountChange={handleAmountChange}
        transactionType={transactionType}
        handleTransactionTypeChange={handleTransactionTypeChange}
        categories={categories}
        category={category}
        setCategory={setCategory}
        date={date}
        handleDateChange={handleDateChange}
      />

      <FinanceOverview
        update={update}
        handleOpenDialog={handleOpenDialog}
        triggerUpdate={triggerUpdate}
        favorites={favorites}
        handleCategoryChange={handleCategoryChange}
        handleSearchInputChange={handleSearchInputChange}
      />
    </Grid>
  );
}

export default FinancePage;
