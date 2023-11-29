/* Copyright (c) 2023, Jason Oltzen */
import { Alert, Grid, Snackbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import AddFavorites from "./favoritesdialog";
import FavoritesOverview from "./overview";
function FavoritesPage() {
  const today = new Date().toISOString().split("T")[0];
  const theme = useTheme();
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("Ausgabe");
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [update, setUpdate] = useState(false);
  const [updateNeeded, setUpdateNeeded] = useState(false);
  const [isOwn, setIsOwn] = useState(true);

  const triggerUpdate = () => {
    setUpdateNeeded((prev) => !prev);
  };

  const { user } = useAuth();

  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Can be "success", "error", "warning", or "info"

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
    event.preventDefault();
    try {
      const response = await axiosInstance.post("/addFavorites", {
        isOwn,
        description,
        amount,
        transactionType,
        user_id: user.id,
        category_id: category,
        transaction_id: null,
      });
      setFavorites((prevFavorites) => [
        ...prevFavorites,
        response.data.favorites,
      ]);
      setAmount("");
      setDescription("");
      setDate(date);
      setTransactionType("Ausgabe");
      setCategory(category);
      setSnackbarMessage("Favorites erfolgreich hinzugefügt!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Favorites failed:", error);
      setSnackbarMessage("Fehler beim hinzufügen der Favoriten!");
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
  }, [user.id, update]);

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
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
        <AddFavorites
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

        <FavoritesOverview
          update={update}
          handleOpenDialog={handleOpenDialog}
          triggerUpdate={triggerUpdate}
        />
      </Grid>
    </Box>
  );
}

export default FavoritesPage;
