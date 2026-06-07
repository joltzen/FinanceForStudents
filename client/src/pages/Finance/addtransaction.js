/* Copyright (c) 2023, Jason Oltzen */

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
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
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user } = useAuth();
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [sumForSelectedCategory, setSumForSelectedCategory] = useState(0);
  const [showBudgetWarningDialog, setShowBudgetWarningDialog] = useState(false);

  const testAmount = () => {
    const selectedCat = categories.find((c) => c.id === category);
    if ((selectedCat?.max || 0) - parseFloat(amount) < 0) {
      setShowBudgetWarningDialog(true);
    } else {
      handleSubmit({ preventDefault: () => {} });
    }
  };

  useEffect(() => {
    if (!date) return;
    const [year, month] = date.split("-");
    getTransactions(user.id, parseInt(month), parseInt(year))
      .then(setFilteredTransactions)
      .catch(console.error);
  }, [date, user.id]);

  useEffect(() => {
    const cat = categories.find((c) => c.id === category);
    if (cat?.max) {
      const total = filteredTransactions.filter((t) => t.category_id === category).reduce((s, t) => s + parseFloat(t.amount || 0), 0);
      setSumForSelectedCategory(cat.max - total);
    } else {
      setSumForSelectedCategory(0);
    }
  }, [filteredTransactions, category, categories]);

  const currentCat = categories.find((c) => c.id === category);

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
      "& fieldset": { borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)" },
      "&:hover fieldset": { borderColor: "rgba(198,170,96,0.5)" },
      "&.Mui-focused fieldset": { borderColor: "#c6aa60" },
    },
    "& .MuiInputLabel-root": { color: isDark ? "rgba(224,227,233,0.5)" : "rgba(44,47,54,0.5)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#c6aa60" },
    "& .MuiInputBase-input": { color: theme.palette.text.main },
  };

  const bg = isDark ? "#262b3d" : "#ffffff";

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm"
      PaperProps={{ sx: { backgroundColor: bg, borderRadius: 3 } }}>
      <DialogTitle sx={{ backgroundColor: bg, color: theme.palette.text.main, fontWeight: 700, pb: 1 }}>
        Transaktion hinzufügen
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: bg, pt: "12px !important", display: "flex", flexDirection: "column", gap: 2 }}>

        <FormControl fullWidth size="small">
          <Select
            value={transactionType}
            onChange={handleTransactionTypeChange}
            sx={{
              borderRadius: 2,
              color: theme.palette.text.main,
              backgroundColor: transactionType === "Ausgabe"
                ? "rgba(239,83,80,0.1)"
                : "rgba(102,187,106,0.1)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: transactionType === "Ausgabe"
                  ? "rgba(239,83,80,0.3)"
                  : "rgba(102,187,106,0.3)",
              },
              fontWeight: 600,
            }}
          >
            <MenuItem value="Ausgabe">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#ef5350" }} />
                Ausgabe
              </Box>
            </MenuItem>
            <MenuItem value="Einnahme">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#66bb6a" }} />
                Einnahme
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        <TextField label="Beschreibung" variant="outlined" fullWidth autoFocus
          value={description} onChange={handleDescriptionChange} sx={fieldSx} />

        <TextField label="Betrag (€)" variant="outlined" fullWidth type="number"
          value={amount} onChange={handleAmountChange} sx={fieldSx} />

        <TextField label="Datum" variant="outlined" fullWidth type="date"
          value={date} onChange={handleDateChange} InputLabelProps={{ shrink: true }} sx={fieldSx} />

        <FormControl fullWidth>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{
              borderRadius: 2,
              color: theme.palette.text.main,
              backgroundColor: currentCat ? `${currentCat.color}22` : "transparent",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: currentCat ? `${currentCat.color}55` : (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"),
              },
              fontWeight: 600,
            }}
            renderValue={(val) => {
              const c = categories.find((x) => x.id === val);
              return c ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: c.color }} />
                  {c.name}
                </Box>
              ) : "Kategorie wählen";
            }}
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: c.color, flexShrink: 0 }} />
                  <Typography variant="body2">{c.name}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {sumForSelectedCategory !== 0 && (
          <Box sx={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            px: 2, py: 1.5,
            borderRadius: 2,
            backgroundColor: sumForSelectedCategory > 0 ? "rgba(102,187,106,0.1)" : "rgba(239,83,80,0.1)",
            border: `1px solid ${sumForSelectedCategory > 0 ? "rgba(102,187,106,0.3)" : "rgba(239,83,80,0.3)"}`,
          }}>
            <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.7 }}>Restbudget Kategorie</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: sumForSelectedCategory > 0 ? "#66bb6a" : "#ef5350" }}>
              {sumForSelectedCategory.toFixed(2)} €
            </Typography>
          </Box>
        )}

        <BudgetWarningDialog
          showBudgetWarningDialog={showBudgetWarningDialog}
          setShowBudgetWarningDialog={setShowBudgetWarningDialog}
          handleSubmit={handleSubmit}
          theme={theme}
        />
      </DialogContent>
      <DialogActions sx={{ backgroundColor: bg, px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={handleCloseDialog} variant="outlined"
          sx={{ borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)", color: theme.palette.text.main, borderRadius: 2 }}>
          Abbrechen
        </Button>
        <Button onClick={testAmount} variant="contained"
          sx={{ backgroundColor: "#c6aa60", color: "#1a1e2e", fontWeight: 700, borderRadius: 2, px: 3,
            "&:hover": { backgroundColor: "#b99a50" } }}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTransaction;
