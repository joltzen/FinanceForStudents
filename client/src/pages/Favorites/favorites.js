/* Copyright (c) 2023, Jason Oltzen */

import { Alert, Grid, Snackbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../core/auth/auth";
import { addFavorite, getCategories } from "../../services/db";
import AddFavorites from "./favoritesdialog";
import FavoritesOverview from "./overview";

function FavoritesPage() {
  const today = new Date().toISOString().split("T")[0];
  const theme = useTheme();
  const { user } = useAuth();

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("Ausgabe");
  const [categories, setCategories] = useState([]);
  const [update, setUpdate] = useState(false);
  const [updateNeeded, setUpdateNeeded] = useState(false);
  const [isOwn, setIsOwn] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const triggerUpdate = () => setUpdateNeeded((prev) => !prev);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await addFavorite(user.id, {
        is_own: isOwn,
        description,
        amount,
        transaction_type: transactionType,
        category_id: category,
        transaction_id: null,
      });
      setAmount("");
      setDescription("");
      setTransactionType("Ausgabe");
      setSnackbarMessage("Favorit erfolgreich hinzugefügt!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Favorites failed:", error);
      setSnackbarMessage("Fehler beim Hinzufügen der Favoriten!");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories(user.id);
        setCategories(cats);
        if (cats.length > 0) setCategory(cats[0].id);
      } catch (error) {
        console.error("Fehler beim Laden der Kategorien:", error);
      }
    };
    fetchCategories();
  }, [user.id, update]);

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Grid item xs={12} md={8} lg={6}>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <AddFavorites
          openDialog={openDialog}
          handleCloseDialog={() => { setUpdate(!update); setOpenDialog(false); }}
          theme={theme}
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
          date={today}
          handleDateChange={() => {}}
        />
        <FavoritesOverview
          update={update}
          handleOpenDialog={() => setOpenDialog(true)}
          triggerUpdate={triggerUpdate}
        />
      </Grid>
    </Box>
  );
}

export default FavoritesPage;
