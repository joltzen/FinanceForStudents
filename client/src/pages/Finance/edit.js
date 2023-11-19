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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import TextComp from "../../components/TextComp";

export default function EditTransactionDialog({
  transaction,
  onClose,
  onSave,
  categories,
}) {
  const [editedTransaction, setEditedTransaction] = useState({
    ...transaction,
  });
  const theme = useTheme();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTransaction({
      ...editedTransaction,
      [name]: value,
    });
  };

  const handleCategoryChange = (event) => {
    setEditedTransaction({
      ...editedTransaction,
      category_id: event.target.value,
    });
  };
  // Updated handler specifically for the Select component
  const handleSelectChange = (event) => {
    console.log(event.target.value);
    setEditedTransaction({
      ...editedTransaction,
      transaction_type: event.target.value,
    });
  };
  const getCurrentCategoryColor = () => {
    const currentCategory = categories.find(
      (cat) => cat.id === editedTransaction.category_id
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
    onSave(editedTransaction);
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
    <Dialog open={!!transaction} onClose={onClose}>
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.card.main,
          color: theme.palette.text.main,
        }}
      >
        Bearbeiten
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: theme.palette.card.main }}>
        <InputLabel
          sx={{ color: theme.palette.text.main, mt: 2, mb: 2 }}
          id="category-label"
        >
          Transaktionstyp
        </InputLabel>
        <FormControl fullWidth sx={{ minWidth: "10vw" }}>
          <Select
            value={editedTransaction.transaction_type}
            onChange={handleSelectChange}
            label="Transaktionstyp"
            sx={{
              color: theme.palette.text.main,
              backgroundColor: theme.palette.select.main,
              border: `1px solid ${theme.palette.text.main}`, // Use template literal for dynamic value
            }}
          >
            <MenuItem value="Ausgabe">Ausgabe</MenuItem>
            <MenuItem value="Einnahme">Einnahme</MenuItem>
          </Select>
        </FormControl>
        <InputLabel
          sx={{ color: theme.palette.text.main, mt: 2 }}
          id="category-label"
        >
          Beschreibung
        </InputLabel>
        <TextComp
          type="text"
          name="description"
          value={editedTransaction.description}
          onChange={handleInputChange}
          fullWidth
        />
        <InputLabel
          sx={{ color: theme.palette.text.main, mt: 2 }}
          id="category-label"
        >
          Betrag
        </InputLabel>
        <TextComp
          type="number"
          name="amount"
          value={editedTransaction.amount}
          onChange={handleInputChange}
          fullWidth
        />
        <InputLabel
          sx={{ color: theme.palette.text.main, mt: 2 }}
          id="category-label"
        >
          Datum
        </InputLabel>
        <TextComp
          fullWidth
          name="transaction_date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formatDate(editedTransaction.transaction_date)}
          onChange={handleInputChange}
        />
        <InputLabel
          sx={{ color: theme.palette.text.main, mt: 2, mb: 2 }}
          id="category-label"
        >
          Kategorie
        </InputLabel>
        <Select
          fullWidth
          value={editedTransaction.category_id}
          onChange={handleCategoryChange}
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
          }}
        >
          {categories.map((category) => (
            <MenuItem
              key={category.id}
              value={category.id}
              sx={{
                backgroundColor: category.color,
                "&.Mui-selected": {
                  // This targets the selected item specifically
                  backgroundColor: category.color,
                  fontWeight: "bold",
                },
                "&:hover": {
                  backgroundColor: adjustColor(category.color, 20),
                },
              }}
            >
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: theme.palette.card.main }}>
        <Button onClick={onClose} sx={{ color: theme.palette.text.main }}>
          Abbrechen
        </Button>
        <Button onClick={handleSave} sx={{ color: theme.palette.text.main }}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}
