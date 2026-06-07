/* Copyright (c) 2023, Jason Oltzen */

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../core/auth/auth";
import { getTransactions } from "../../services/db";
import BudgetWarningDialog from "./budgetdialog";

function AddTransaction({
  openDialog,
  handleCloseDialog,
  handleSubmit,
  description,
  handleDescriptionChange,
  amount,
  handleAmountChange,
  transactionType,
  handleTransactionTypeChange,
  categories,
  category,
  setCategory,
  date,
  handleDateChange,
}) {
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [sumForSelectedCategory, setSumForSelectedCategory] = useState(0);
  const { user } = useAuth();
  const [showBudgetWarningDialog, setShowBudgetWarningDialog] = useState(false);
  const theme = useTheme();

  const testAmount = () => {
    const selectedCategory = categories.find((cat) => cat.id === category);
    const potentialNewSum = (selectedCategory?.max || 0) - amount;
    if (potentialNewSum < 0) {
      setShowBudgetWarningDialog(true);
    } else {
      handleSubmit({ preventDefault: () => {} });
    }
  };

  useEffect(() => {
    if (!date) return;
    const [year, month] = date.split("-");
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions(user.id, parseInt(month), parseInt(year));
        setFilteredTransactions(data);
      } catch (error) {
        console.error("Fehler beim Laden der Transaktionen:", error);
      }
    };
    fetchTransactions();
  }, [date, user.id]);

  useEffect(() => {
    const selectedCat = categories.find((cat) => cat.id === category);
    if (selectedCat?.max) {
      const total = filteredTransactions
        .filter((t) => t.category_id === category)
        .reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);
      setSumForSelectedCategory(selectedCat.max - total);
    } else {
      setSumForSelectedCategory(0);
    }
  }, [filteredTransactions, category, categories]);

  const getCurrentCategoryColor = () => {
    const cat = categories.find((c) => c.id === category);
    return cat ? cat.color : "defaultColor";
  };

  const adjustColor = (color, amount) => {
    let usePound = false;
    if (color[0] === "#") { color = color.slice(1); usePound = true; }
    const num = parseInt(color, 16);
    let r = Math.min(255, Math.max(0, (num >> 16) + amount));
    let b = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
    let g = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  };

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
      <DialogTitle sx={{ backgroundColor: theme.palette.card.main, color: theme.palette.text.main, fontSize: "1.2rem" }}>
        Transaktion Hinzufügen
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: theme.palette.card.main, padding: "20px" }}>
        <InputLabel style={{ color: theme.palette.text.main }}>Transaktionstyp</InputLabel>
        <FormControl fullWidth margin="normal">
          <Select value={transactionType} onChange={handleTransactionTypeChange}
            sx={{ color: theme.palette.text.main, height: "40px", border: `1px solid ${theme.palette.text.main}` }}>
            <MenuItem value="Ausgabe">Ausgabe</MenuItem>
            <MenuItem value="Einnahme">Einnahme</MenuItem>
          </Select>
        </FormControl>
        <InputLabel style={{ color: theme.palette.text.main }}>Beschreibung</InputLabel>
        <TextField variant="outlined" fullWidth autoFocus name="description" margin="normal"
          value={description} onChange={handleDescriptionChange}
          sx={{ ".MuiOutlinedInput-root": { height: "40px", border: `1px solid ${theme.palette.text.main}` } }} />
        <InputLabel style={{ color: theme.palette.text.main }}>Betrag</InputLabel>
        <TextField variant="outlined" fullWidth name="amount" margin="normal" type="number"
          value={amount} onChange={handleAmountChange}
          sx={{ ".MuiOutlinedInput-root": { height: "40px", border: `1px solid ${theme.palette.text.main}` } }} />
        <InputLabel style={{ color: theme.palette.text.main }}>Datum</InputLabel>
        <TextField fullWidth name="date" type="date" value={date} onChange={handleDateChange}
          sx={{ ".MuiOutlinedInput-root": { height: "40px", border: `1px solid ${theme.palette.text.main}` }, marginBottom: 2 }} />
        <InputLabel style={{ color: theme.palette.text.main }}>Kategorie</InputLabel>
        <Select fullWidth value={category} onChange={(e) => setCategory(e.target.value)}
          sx={{ color: theme.palette.text.main, "& .MuiSelect-select": { backgroundColor: getCurrentCategoryColor() } }}>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}
              sx={{ backgroundColor: cat.color, "&.Mui-selected": { backgroundColor: cat.color, fontWeight: "bold" },
                "&:hover": { backgroundColor: adjustColor(cat.color, 20) } }}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
        <BudgetWarningDialog
          showBudgetWarningDialog={showBudgetWarningDialog}
          setShowBudgetWarningDialog={setShowBudgetWarningDialog}
          handleSubmit={handleSubmit}
          theme={theme}
        />
        <h3>Restbudget für die ausgewählte Kategorie: {sumForSelectedCategory.toFixed(2)} €</h3>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: theme.palette.card.main, padding: "10px" }}>
        <Button onClick={handleCloseDialog} variant="contained">Abbrechen</Button>
        <Button onClick={testAmount} color="primary" variant="contained">Speichern</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTransaction;
