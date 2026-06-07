/* Copyright (c) 2026, Jason Oltzen */

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Circle from "@uiw/react-color-circle";
import React, { useEffect, useState } from "react";
import TextComp from "../../components/TextComp";
import { useAuth } from "../../core/auth/auth";
import { addCategory, deleteCategory, getCategories } from "../../services/db";
import { colors } from "../../config/constants";

function AddCategory({
  isCategoryWarningOpen,
  handleCategoryAdded,
  onCategoryAdded,
}) {
  const theme = useTheme();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryColor, setCategoryColor] = useState("#F44E3B");
  const [openDialog, setOpenDialog] = useState(false);

  const fetchCats = async () => {
    try {
      setCategories(await getCategories(user.id));
    } catch (error) {
      console.error("Fehler beim Laden der Kategorien:", error);
    }
  };

  useEffect(() => {
    fetchCats();
  }, [user.id]);

  const handleAddCategory = async () => {
    try {
      await addCategory(user.id, { name: newCategory, color: categoryColor });
      setNewCategory("");
      setCategoryColor("#F44E3B");
      setOpenDialog(false);
      fetchCats();
      if (onCategoryAdded) onCategoryAdded();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(user.id, categoryId);
      fetchCats();
    } catch (error) {
      console.error("Fehler beim Löschen der Kategorie:", error);
    }
  };

  function isColorDark(color) {
    const rgb = parseInt(color.substring(1), 16);
    const r = (rgb >> 16) & 0xff,
      g = (rgb >> 8) & 0xff,
      b = (rgb >> 0) & 0xff;
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  }

  const dialogBg = {
    backgroundColor: theme.palette.card.main,
    color: theme.palette.text.main,
  };

  return (
    <div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <Typography
          sx={{ ...dialogBg, p: 2, fontSize: "1.1rem", fontWeight: "bold" }}
        >
          Neue Kategorie
        </Typography>
        <DialogContent sx={dialogBg}>
          <TextComp
            autoFocus
            margin="dense"
            label="Kategoriename"
            type="text"
            fullWidth
            variant="outlined"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Circle
            style={{ marginTop: "50px" }}
            colors={colors}
            color={categoryColor}
            onChange={(color) => setCategoryColor(color.hex)}
          />
        </DialogContent>
        <DialogActions sx={dialogBg}>
          <Button onClick={() => setOpenDialog(false)} sx={dialogBg}>
            Abbrechen
          </Button>
          <Button
            onClick={() => {
              handleAddCategory();
              if (handleCategoryAdded) handleCategoryAdded();
            }}
            sx={dialogBg}
          >
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={2}>
        {categories?.map((category, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper
              sx={{
                backgroundColor: category.color,
                padding: "10px",
                marginTop: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  color: isColorDark(category.color)
                    ? theme.palette.text.main
                    : "black",
                }}
              >
                {category.name}
              </Typography>
              <div style={{ display: "flex" }}>
                <IconButton
                  onClick={() => handleDeleteCategory(category.id)}
                  style={{ color: "black" }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Button
        sx={{ marginTop: 2 }}
        onClick={() => setOpenDialog(true)}
        variant="contained"
      >
        Kategorie hinzufügen
      </Button>
    </div>
  );
}

export default AddCategory;
