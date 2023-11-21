/* Copyright (c) 2023, Jason Oltzen */

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import SelectComp from "../../components/SelectComp";
import TextComp from "../../components/TextComp";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
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
  }, [user.id, update, categories]);

  return (
    <Grid item xs={12} md={8} lg={6}>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        justifyContent="center"
        maxWidth="sm"
        alignItems="center"
        sx={{ marginTop: "5%" }}
      >
        <DialogContent sx={{ backgroundColor: theme.palette.card.main }}>
          <form onSubmit={handleSubmit}>
            <InputLabel
              sx={{ color: theme.palette.text.main, mt: 2, mb: 2 }}
              id="category-label"
            >
              Transaktionstyp
            </InputLabel>
            <FormControl fullWidth>
              <SelectComp
                value={transactionType}
                onChange={handleTransactionTypeChange}
              >
                <MenuItem value="Ausgabe">Ausgabe</MenuItem>
                <MenuItem value="Einnahme">Einnahme</MenuItem>
              </SelectComp>
            </FormControl>
            <InputLabel
              sx={{ color: theme.palette.text.main, mt: 2 }}
              id="category-label"
            >
              Beschreibung
            </InputLabel>
            <TextComp
              type="text"
              value={description}
              onChange={handleDescriptionChange}
              fullWidth
              autoFocus
              required
            />
            <InputLabel
              sx={{ color: theme.palette.text.main, mt: 2 }}
              id="category-label"
            >
              Betrag
            </InputLabel>
            <TextComp
              type="number"
              value={amount}
              onChange={handleAmountChange}
              fullWidth
              required
            />
            <InputLabel
              sx={{ color: theme.palette.text.main, mt: 2 }}
              id="category-label"
            >
              Datum
            </InputLabel>
            <TextComp
              fullWidth
              name="date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={handleDateChange}
            />
            {categories.length > 0 ? (
              <>
                <InputLabel
                  sx={{ color: theme.palette.text.main, mt: 2, mb: 2 }}
                  id="category-label"
                >
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
              </>
            ) : (
              <Typography sx={{ color: theme.palette.text.main, mt: 2 }}>
                Noch keine Kategorie vorhanden
              </Typography>
            )}
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

      <FinanceOverview update={update} handleOpenDialog={handleOpenDialog} />
    </Grid>
  );
}

export default FinancePage;
