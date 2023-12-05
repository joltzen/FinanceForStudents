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
import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import BudgetWarningDialog from "./budgetdialog";

function AddTransaction({
  openDialog,
  handleCloseDialog,
  theme,
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
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [sumsByCategory, setSumsByCategory] = useState({});
  const [sumForSelectedCategory, setSumForSelectedCategory] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const { user } = useAuth();
  const [showBudgetWarningDialog, setShowBudgetWarningDialog] = useState(false);

  // 2. Logik zur Überprüfung des Budgets anpassen
  const testAmount = () => {
    console.log("test");
    const selectedCategory = categories.find((cat) => cat.id === category);
    const potentialNewSum = (selectedCategory.max || 0) - amount;

    if (potentialNewSum < 0) {
      setShowBudgetWarningDialog(true);
    } else {
      handleSubmit({ preventDefault: () => {} }); // Mit einem synthetischen Event
    }
  };

  const filterTransactions = (selectedDate, transactions) => {
    const [selectedYear, selectedMonth] = selectedDate.split("-");

    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance.get("/getTransactions", {
          params: {
            month: selectedMonth,
            year: selectedYear,
            user_id: user.id,
          },
        });
        setFilteredTransactions(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Transaktionen:", error);
      }
    };
    fetchTransactions();
  };

  const calculateSumsByCategory = (transactions, categoryMap) => {
    // We use the categoryMap here to translate category IDs to their names
    return transactions.reduce((acc, transaction) => {
      const categoryName =
        categoryMap[transaction.category_id] || "Unknown Category";
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += parseFloat(transaction.amount || 0);
      return acc;
    }, {});
  };

  const getCurrentCategoryColor = () => {
    const currentCategory = categories.find((cat) => cat.id === category);
    return currentCategory ? currentCategory.color : "defaultColor";
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
    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance.get("/getTransactions", {
          params: {
            user_id: user.id,
          },
        });
        setAllTransactions(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Transaktionen:", error);
      }
    };
    fetchTransactions();
    const calculateSumForSelectedCategory = () => {
      const selectedCategoryTransactions = filteredTransactions.filter(
        (transaction) => transaction.category_id === category
      );
      const totalAmountInCategory = selectedCategoryTransactions.reduce(
        (acc, transaction) => acc + parseFloat(transaction.amount || 0),
        0
      );
      const selectedCategory = categories.find((cat) => cat.id === category);
      if (selectedCategory && selectedCategory.max) {
        const maxBudget = selectedCategory.max;
        setSumForSelectedCategory(maxBudget - totalAmountInCategory);
      } else {
        setSumForSelectedCategory(0.0);
      }
    };

    calculateSumForSelectedCategory();
  }, [date, allTransactions, filteredTransactions, category, categories]);

  useEffect(() => {
    if (date) {
      filterTransactions(date, allTransactions);
    }
  }, []);

  useEffect(() => {
    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.id] = cat.name;
      return acc;
    }, {});

    setSumsByCategory(
      calculateSumsByCategory(filteredTransactions, categoryMap)
    );
  }, [filteredTransactions, categories]);

  return (
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
          autoFocus
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
        <BudgetWarningDialog
          showBudgetWarningDialog={showBudgetWarningDialog}
          setShowBudgetWarningDialog={setShowBudgetWarningDialog}
          handleSubmit={handleSubmit}
        />
        {showWarning && (
          <div style={{ color: "red" }}>
            Warnung: Dieser Betrag überschreitet Ihr Budget für die Kategorie.
          </div>
        )}
        <div>
          <h3>Summe für ausgewählte Kategorie:</h3>
          <div>
            {categories.find((cat) => cat.id === category)?.name ||
              "Unknown Category"}
            :{sumForSelectedCategory.toFixed(2)} €
          </div>
        </div>
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
        <Button onClick={testAmount} color="primary" variant="contained">
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTransaction;
