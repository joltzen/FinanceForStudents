/* Copyright (c) 2026, Jason Oltzen */

import { Alert, AlertColor, Grid, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../core/auth/auth";
import { addTransaction, getCategories } from "../../services/db";
import AddTransaction from "./addtransaction";
import FinanceOverview from "./overview";

function FinancePage() {
  const today = new Date().toISOString().split("T")[0];
  const { user } = useAuth();

  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("success");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("Ausgabe");
  const [categories, setCategories] = useState([]);
  const [update, setUpdate] = useState(false);
  const [updateNeeded, setUpdateNeeded] = useState(false);

  const triggerUpdate = () => setUpdateNeeded((prev) => !prev);

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    try {
      await addTransaction(user.id, {
        date,
        description,
        amount,
        transaction_type: transactionType,
        transaction_date: date,
        category_id: category,
        favorites: false,
      });
      setAmount("");
      setDescription("");
      setDate(date);
      setTransactionType("Ausgabe");
      setSnackbarMessage("Transaktion erfolgreich hinzugefügt!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Transaction failed:", error);
      setSnackbarMessage("Fehler beim Hinzufügen der Transaktion!");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await getCategories(user.id);
        setCategories(cats);
        if (cats.length > 0) setCategory(cats[0].id);
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
      }
    };
    fetchData();
  }, [user.id, update, updateNeeded]);

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
        handleCloseDialog={() => {
          setUpdate(!update);
          setOpenDialog(false);
        }}
        handleSubmit={handleSubmit}
        description={description}
        handleDescriptionChange={(e) => setDescription(e.target.value)}
        amount={amount}
        handleAmountChange={(e) => setAmount(e.target.value)}
        transactionType={transactionType}
        handleTransactionTypeChange={(e) => setTransactionType(e.target.value)}
        categories={categories}
        category={category}
        setCategory={setCategory}
        date={date}
        handleDateChange={(e) => setDate(e.target.value)}
      />
      <FinanceOverview
        update={update}
        handleOpenDialog={() => setOpenDialog(true)}
        triggerUpdate={triggerUpdate}
      />
    </Grid>
  );
}

export default FinancePage;
