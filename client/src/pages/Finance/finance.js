/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Container, styled } from "@mui/system";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import FinanceOverview from "./overview";
import TextComp from "../../components/TextComp";
import SelectComp from "../../components/SelectComp";
import AddButton from "../../components/AddButtonComp";
import { useTheme } from "@mui/material/styles";
import Page from "../../components/page";

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

  return (
    <Page>
      <Grid item xs={12} md={8} lg={6}>
        <AddButton
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleOpenDialog}
        >
          Transaktion hinzufügen
        </AddButton>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle
            sx={{
              backgroundColor: theme.palette.card.main,
              color: theme.palette.text.main,
            }}
          >
            Neue Transaktion
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: theme.palette.card.main }}>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth>
                <InputLabel style={{ color: theme.palette.text.main }}>
                  Transaktionstyp
                </InputLabel>
                <SelectComp
                  value={transactionType}
                  onChange={handleTransactionTypeChange}
                  label="Transaktionstyp"
                >
                  <MenuItem value="Ausgabe">Ausgabe</MenuItem>
                  <MenuItem value="Einnahme">Einnahme</MenuItem>
                </SelectComp>
              </FormControl>
              <TextComp
                label="Beschreibung"
                type="text"
                value={description}
                onChange={handleDescriptionChange}
                fullWidth
                required
              />
              <TextComp
                label="Betrag"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                fullWidth
                required
              />
              <TextComp
                fullWidth
                label="Datum"
                name="date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={handleDateChange}
              />
              <InputLabel
                sx={{ color: theme.palette.text.main, mt: 2 }}
                id="category-label"
              >
                Kategorie
              </InputLabel>
              <Select
                fullWidth
                labelId="category-label"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Kategorie"
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
                  // "& .MuiList-root .Mui-selected": {
                  //   // Increased specificity for selected MenuItem
                  //   backgroundColor: (theme) =>
                  //     `${adjustColor(
                  //       getCurrentCategoryColor(),
                  //       -20
                  //     )} !important`, // Using !important to override Material-UI's default styles
                  //   "&:hover": {
                  //     backgroundColor: (theme) =>
                  //       adjustColor(getCurrentCategoryColor(), -10),
                  //   },
                  // },
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
            </form>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: theme.palette.card.main }}>
            <Button
              onClick={handleCloseDialog}
              color="primary"
              sx={{ color: theme.palette.text.main }}
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleSubmit}
              color="primary"
              sx={{ color: theme.palette.text.main }}
            >
              Speichern
            </Button>
          </DialogActions>
        </Dialog>

        <Typography
          variant="h6"
          color={theme.palette.text.main}
          sx={{ mb: 2, mt: 2 }}
        >
          Transaktionen Übersicht
        </Typography>
        <FinanceOverview update={update} />
      </Grid>
    </Page>
  );
}

export default FinancePage;
