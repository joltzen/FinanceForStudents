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
import React, { useState } from "react";

export default function EditTransactionDialog({
  favorites,
  onClose,
  onSave,
  categories,
}) {
  const [editedFavorites, setEditedFavorites] = useState({
    ...favorites,
  });
  const theme = useTheme();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedFavorites({
      ...editedFavorites,
      [name]: value,
    });
  };

  const handleCategoryChange = (event) => {
    setEditedFavorites({
      ...editedFavorites,
      category_id: event.target.value,
    });
  };
  // Updated handler specifically for the Select component
  const handleSelectChange = (event) => {
    setEditedFavorites({
      ...editedFavorites,
      transaction_type: event.target.value,
    });
  };
  const getCurrentCategoryColor = () => {
    const currentCategory = categories.find(
      (cat) => cat.id === editedFavorites.category_id
    );
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

  const handleSave = () => {
    onSave(editedFavorites);
    onClose();
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = "0" + month;
    }
    if (day.length < 2) {
      day = "0" + day;
    }

    return [year, month, day].join("-");
  }
  return (
    <Dialog open={!!favorites} onClose={onClose} fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.card.main,
          color: theme.palette.text.main,
          fontSize: "1.2rem", // Größere Schrift für den Titel
        }}
      >
        Favoriten bearbeiten
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
            value={editedFavorites.transaction_type}
            onChange={handleSelectChange}
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
          value={editedFavorites.description}
          onChange={handleInputChange}
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
          value={editedFavorites.amount}
          onChange={handleInputChange}
          sx={{
            ".MuiOutlinedInput-root": {
              height: "40px",
              border: `1px solid ${theme.palette.text.main}`,
            },
          }}
        />

        {/* Jahr */}
        <InputLabel style={{ color: theme.palette.text.main }}>
          Kategorie
        </InputLabel>
        <Select
          fullWidth
          labelId="category-label"
          value={editedFavorites.category_id}
          onChange={handleCategoryChange}
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
      </DialogContent>
      <DialogActions
        sx={{ backgroundColor: theme.palette.card.main, padding: "10px" }}
      >
        <Button onClick={onClose} color="secondary" variant="outlined">
          Abbrechen
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}
