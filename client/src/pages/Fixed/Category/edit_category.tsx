import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  InputLabel,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Circle from "@uiw/react-color-circle";
import React from "react";

export function Edit({
  openEditDialog,
  setOpenEditDialog,
  editingCategory,
  newCategory,
  setNewCategory,
  maxAmount,
  setMaxAmount,
  colors,
  categoryColor,
  setCategoryColor,
  handleEditCategory,
}) {
  const theme = useTheme();

  return (
    <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
      <DialogContent
        sx={{
          backgroundColor: theme.palette.card.main,
          color: theme.palette.text.main,
        }}
      >
        <DialogContentText
          sx={{
            backgroundColor: theme.palette.card.main,
            color: theme.palette.text.main,
            mb: 4,
          }}
        >
          Kategorie <strong>{editingCategory?.name}</strong> bearbeiten
        </DialogContentText>
        <InputLabel
          style={{
            color: theme.palette.text.main,
          }}
        >
          Kategoriename
        </InputLabel>
        <TextField
          autoFocus
          variant="outlined"
          fullWidth
          name="description"
          margin="normal"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          sx={{
            ".MuiOutlinedInput-root": {
              height: "40px",
              border: `1px solid ${theme.palette.text.main}`,
            },
          }}
        />
        <InputLabel
          style={{
            color: theme.palette.text.main,
          }}
        >
          Maximale Ausgabe pro Monat
        </InputLabel>
        <TextField
          autoFocus
          variant="outlined"
          fullWidth
          name="maxamount"
          type="number"
          margin="normal"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
          sx={{
            ".MuiOutlinedInput-root": {
              height: "40px",
              border: `1px solid ${theme.palette.text.main}`,
            },
          }}
        />
        <Circle
          style={{
            marginTop: "50px",
          }}
          colors={colors}
          color={categoryColor}
          onChange={(color) => {
            setCategoryColor(color.hex);
          }}
        />
      </DialogContent>{" "}
      <DialogActions
        sx={{
          backgroundColor: theme.palette.card.main,
          color: theme.palette.text.main,
        }}
      >
        <Button
          sx={{
            backgroundColor: theme.palette.card.main,
            color: theme.palette.text.main,
          }}
          onClick={() => setOpenEditDialog(false)}
        >
          Abbrechen
        </Button>
        <Button
          sx={{
            backgroundColor: theme.palette.card.main,
            color: theme.palette.text.main,
          }}
          onClick={handleEditCategory}
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}
