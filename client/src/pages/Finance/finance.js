/* Copyright (c) 2023, Jason Oltzen */

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import AddTransaction from "./addtransaction";
import FinanceOverview from "./overview";
function FinancePage() {
  const today = new Date().toISOString().split("T")[0];
  const theme = useTheme();
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("Ausgabe");
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [update, setUpdate] = useState(false);
  const [updateNeeded, setUpdateNeeded] = useState(false);

  const triggerUpdate = () => {
    setUpdateNeeded((prev) => !prev);
  };

  const { user } = useAuth();

  const [openDialog, setOpenDialog] = useState(false);

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

  const getCurrentCategoryColor = () => {
    if (!Array.isArray(categories)) return "defaultColor";
    const currentCategory = categories.find((cat) => cat.id === category);
    return currentCategory ? currentCategory.color : "defaultColor";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post("/addTransaction", {
        date,
        description,
        amount,
        transactionType,
        user_id: user.id,
        category_id: category,
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
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };
  const adjustColor = (color, amount) => {
    let usePound = false;
    if (color[0] === "#") {
      color = color.slice(1);
      usePound = true;
    }

    const num = parseInt(color, 16);

    let r = (num >> 16) + amount;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    let b = ((num >> 8) & 0x00ff) + amount;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    let g = (num & 0x0000ff) + amount;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
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

  const handleCategoryChange = (e) => {
    const newCategory = e?.target?.value || ""; // Fallback zu einem leeren String
    setCategory(newCategory);
    console.log("Ausgewählte Kategorie:", newCategory);
  };
  return (
    <Grid item xs={12} md={8} lg={6}>
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.card.main,
            color: theme.palette.text.main,
            fontSize: "1.2rem", // Größere Schrift für den Titel
          }}
        >
          Transaktion Hinzufügen
        </DialogTitle>
        <DialogContent
          sx={{ backgroundColor: theme.palette.card.main, padding: "20px" }}
        >
          {/* Transaktionstyp */}
          <InputLabel style={{ color: theme.palette.text.main }}>
            Transaktionstyp
          </InputLabel>
          <FormControl fullWidth margin="normal">
            <Select
              value={transactionType}
              onChange={handleTransactionTypeChange}
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
              <MenuItem value="Ausgabe">Ausgabe</MenuItem>
              <MenuItem value="Einnahme">Einnahme</MenuItem>
            </Select>
          </FormControl>

          {/* Beschreibung */}
          <InputLabel style={{ color: theme.palette.text.main }}>
            Beschreibung
          </InputLabel>
          <TextField
            variant="outlined"
            fullWidth
            name="description"
            margin="normal"
            value={description}
            onChange={handleDescriptionChange}
            sx={{
              ".MuiOutlinedInput-root": {
                height: "40px",
                border: `1px solid ${theme.palette.text.main}`,
              },
            }}
          />

          {/* Betrag */}
          <InputLabel style={{ color: theme.palette.text.main }}>
            Betrag
          </InputLabel>
          <TextField
            variant="outlined"
            fullWidth
            name="amount"
            margin="normal"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            sx={{
              ".MuiOutlinedInput-root": {
                height: "40px",
                border: `1px solid ${theme.palette.text.main}`,
              },
            }}
          />

          {/* Monat */}
          <InputLabel style={{ color: theme.palette.text.main }}>
            Datum
          </InputLabel>
          <TextField
            fullWidth
            name="date"
            type="date"
            value={date}
            onChange={handleDateChange}
            sx={{
              ".MuiOutlinedInput-root": {
                height: "40px",
                border: `1px solid ${theme.palette.text.main}`,
              },
              marginBottom: 2,
            }}
          />

          {/* Jahr */}
          <InputLabel style={{ color: theme.palette.text.main }}>
            Kategorie
          </InputLabel>
          <Select
            fullWidth
            labelId="category-label"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{
              color: theme.palette.text.main,
              "& .MuiSelect-select": {
                backgroundColor: getCurrentCategoryColor(),
              },
              "&:before": {
                borderColor: "black",
              },
              "&:after": {
                borderColor: "black",
              },
            }}
          >
            {categories.map((cat) => (
              <MenuItem
                key={cat.id}
                value={cat.id}
                sx={{
                  backgroundColor: cat.color,
                  "&.Mui-selected": {
                    // This targets the selected item specifically
                    backgroundColor: cat.color,
                    fontWeight: "bold",
                  },
                  "&:hover": {
                    backgroundColor: adjustColor(cat.color, 20),
                  },
                }}
              >
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions
          sx={{ backgroundColor: theme.palette.card.main, padding: "10px" }}
        >
          <Button
            onClick={handleCloseDialog}
            color="secondary"
            variant="outlined"
          >
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Speichern
          </Button>
        </DialogActions>
      </Dialog>

      <FinanceOverview
        update={update}
        handleOpenDialog={handleOpenDialog}
        triggerUpdate={triggerUpdate}
      />
    </Grid>
  );
}

export default FinancePage;
