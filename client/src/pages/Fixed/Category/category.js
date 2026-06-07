/* Copyright (c) 2023, Jason Oltzen */

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  IconButton,
  InputLabel,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Circle from "@uiw/react-color-circle";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../core/auth/auth";
import { addCategory, deleteCategory, getCategories, updateCategory } from "../../../services/db";
import { colors } from "../../../config/constants";

function DialogPage({ onCategoryChange }) {
  const theme = useTheme();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryColor, setCategoryColor] = useState("#F44E3B");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [maxAmount, setMaxAmount] = useState(0);

  const fetchCats = async () => {
    try {
      setCategories(await getCategories(user.id));
    } catch (error) {
      console.error("Fehler beim Laden der Kategorien:", error);
    }
  };

  useEffect(() => { fetchCats(); }, [user.id]);

  const handleAddCategory = async () => {
    try {
      await addCategory(user.id, { name: newCategory, color: categoryColor, max: Number(maxAmount) });
      setSnackbarMessage("Kategorie erfolgreich hinzugefügt!");
      setSnackbarSeverity("success");
      setOpenDialog(false);
      setNewCategory("");
      fetchCats();
      if (onCategoryChange) onCategoryChange();
    } catch (error) {
      setSnackbarMessage("Fehler beim Hinzufügen der Kategorie!");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const handleEditCategory = async () => {
    try {
      await updateCategory(user.id, editingCategory.id, {
        name: newCategory, color: categoryColor, max: Number(maxAmount),
      });
      setSnackbarMessage("Kategorie erfolgreich gespeichert!");
      setSnackbarSeverity("success");
      setOpenEditDialog(false);
      setNewCategory("");
      fetchCats();
    } catch (error) {
      setSnackbarMessage("Fehler beim Speichern der Kategorie!");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(user.id, categoryId);
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      setSnackbarMessage("Kategorie erfolgreich gelöscht!");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Fehler beim Löschen der Kategorie!");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const openEditDialogWithCategory = (category) => {
    setEditingCategory(category);
    setNewCategory(category.name);
    setMaxAmount(category.max || 0);
    setCategoryColor(category.color);
    setOpenEditDialog(true);
  };

  function isColorDark(color) {
    const rgb = parseInt(color.substring(1), 16);
    const r = (rgb >> 16) & 0xff, g = (rgb >> 8) & 0xff, b = (rgb >> 0) & 0xff;
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  }

  const dialogBg = { backgroundColor: theme.palette.card.main, color: theme.palette.text.main };

  return (
    <>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <Typography sx={{ ...dialogBg, p: 2, fontSize: "1.1rem", fontWeight: "bold" }}>
          Neue Kategorie hinzufügen
        </Typography>
        <DialogContent sx={dialogBg}>
          <InputLabel style={{ color: theme.palette.text.main, marginTop: 8 }}>Kategoriename</InputLabel>
          <TextField autoFocus variant="outlined" fullWidth name="description" margin="normal"
            value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
            sx={{ ".MuiOutlinedInput-root": { height: "40px", border: `1px solid ${theme.palette.text.main}` } }} />
          <InputLabel style={{ color: theme.palette.text.main, marginTop: 8 }}>Maximale Ausgabe pro Monat</InputLabel>
          <TextField autoFocus variant="outlined" fullWidth type="number" name="amount" margin="normal"
            value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)}
            sx={{ ".MuiOutlinedInput-root": { height: "40px", border: `1px solid ${theme.palette.text.main}` } }} />
          <Circle style={{ marginTop: "50px" }} colors={colors} color={categoryColor}
            onChange={(color) => setCategoryColor(color.hex)} />
        </DialogContent>
        <DialogActions sx={dialogBg}>
          <Button sx={dialogBg} onClick={() => setOpenDialog(false)}>Abbrechen</Button>
          <Button sx={dialogBg} onClick={handleAddCategory}>Hinzufügen</Button>
        </DialogActions>
      </Dialog>
      <Typography variant="h6" sx={{ mt: 2, color: theme.palette.text.main }}>
        Benutzerdefinierte Kategorien
      </Typography>
      <Grid container spacing={2}>
        {categories?.map((category, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper sx={{ backgroundColor: category.color, padding: "10px", marginTop: "10px",
              display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 5 }}>
              <Typography sx={{ color: isColorDark(category.color) ? theme.palette.text.main : "black", ml: 2 }}>
                {category.name}
              </Typography>
              <div style={{ display: "flex" }}>
                <IconButton onClick={() => openEditDialogWithCategory(category)} style={{ color: "black" }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteCategory(category.id)} style={{ color: "black" }}>
                  <DeleteIcon />
                </IconButton>
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogContent sx={dialogBg}>
          <DialogContentText sx={{ ...dialogBg, mb: 4 }}>
            Kategorie <strong>{editingCategory?.name}</strong> bearbeiten
          </DialogContentText>
          <InputLabel style={{ color: theme.palette.text.main }}>Kategoriename</InputLabel>
          <TextField autoFocus variant="outlined" fullWidth name="description" margin="normal"
            value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
            sx={{ ".MuiOutlinedInput-root": { height: "40px", border: `1px solid ${theme.palette.text.main}` } }} />
          <InputLabel style={{ color: theme.palette.text.main }}>Maximale Ausgabe pro Monat</InputLabel>
          <TextField autoFocus variant="outlined" fullWidth name="maxamount" type="number" margin="normal"
            value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)}
            sx={{ ".MuiOutlinedInput-root": { height: "40px", border: `1px solid ${theme.palette.text.main}` } }} />
          <Circle style={{ marginTop: "50px" }} colors={colors} color={categoryColor}
            onChange={(color) => setCategoryColor(color.hex)} />
        </DialogContent>
        <DialogActions sx={dialogBg}>
          <Button sx={dialogBg} onClick={() => setOpenEditDialog(false)}>Abbrechen</Button>
          <Button sx={dialogBg} onClick={handleEditCategory}>Speichern</Button>
        </DialogActions>
      </Dialog>
      <Button sx={{ marginTop: 3, borderRadius: 5 }} onClick={() => setOpenDialog(true)} variant="contained">
        Kategorie hinzufügen
      </Button>
    </>
  );
}

export default DialogPage;
