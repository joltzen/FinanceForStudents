/* Copyright (c) 2023, Jason Oltzen */

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Circle from "@uiw/react-color-circle";
import React, { useEffect, useState } from "react";
import TextComp from "../../components/TextComp";
import axiosInstance from "../../config/axios";
import { colors } from "../../config/constants";
import { useAuth } from "../../core/auth/auth";

function AddCategory({
  isCategoryWarningOpen,
  handleCategoryAdded,
  onCategoryAdded,
}) {
  const theme = useTheme();

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryColor, setCategoryColor] = useState("#F44E3B");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { user } = useAuth();

  const addCategory = () => {
    setCategories([...categories, { name: newCategory, color: categoryColor }]);
    setNewCategory("");
    setCategoryColor("#FFFFFF");
    setOpenDialog(false);
  };

  const openEditDialogWithCategory = (category) => {
    setEditingCategory(category);
    setNewCategory(category.name);
    setCategoryColor(category.color);
    setOpenEditDialog(true);
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/getCategories", {
          params: { user_id: user.id },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Kategorien:", error);
      }
    };

    fetchCategories();
  }, [user.id]);

  const handleAddCategory = async () => {
    try {
      await axiosInstance.post("/saveCategory", {
        name: newCategory,
        user_id: user.id,
        color: categoryColor,
      });
      // Call the callback function after adding the category
      onCategoryAdded();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axiosInstance.delete("/deleteCategory", {
        params: { id: categoryId },
      });
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
    } catch (error) {
      console.error("Fehler beim Löschen der Kategorie:", error);
    }
  };
  function isColorDark(color) {
    const rgb = parseInt(color.substring(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  }

  return (
    <div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.card.main,
            color: theme.palette.text.main,
          }}
        >
          Neue Kategorie hinzufügen
        </DialogTitle>
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
            }}
          >
            Fügen Sie eine neue Kategorie hinzu und wählen Sie eine Farbe für
            sie.
          </DialogContentText>
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
            onChange={(color) => {
              setCategoryColor(color.hex);
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: theme.palette.card.main,
            color: theme.palette.text.main,
          }}
        >
          <Button
            onClick={() => {
              setOpenDialog(false);
            }}
            sx={{
              backgroundColor: theme.palette.card.main,
              color: theme.palette.text.main,
            }}
          >
            Abbrechen
          </Button>
          <Button
            onClick={() => {
              addCategory();
              handleAddCategory();
              handleCategoryAdded();
            }}
            sx={{
              backgroundColor: theme.palette.card.main,
              color: theme.palette.text.main,
            }}
          >
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2}>
        {categories?.map((category, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper
              key={index}
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
                  onClick={() => openEditDialogWithCategory(category)}
                  style={{ color: "black" }}
                >
                  <EditIcon />
                </IconButton>
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
            }}
          >
            Kategorie <strong>{editingCategory?.name}</strong> bearbeiten
          </DialogContentText>
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
            onClick={() => {
              setOpenEditDialog(false);
              isCategoryWarningOpen(false);
            }}
          >
            Abbrechen
          </Button>
          <Button
            sx={{
              backgroundColor: theme.palette.card.main,
              color: theme.palette.text.main,
            }}
            onClick={() => {
              isCategoryWarningOpen(false);
            }}
          >
            Speichern
          </Button>
        </DialogActions>
      </Dialog>

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
