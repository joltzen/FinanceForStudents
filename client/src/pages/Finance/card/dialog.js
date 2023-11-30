/* Copyright (c) 2023, Jason Oltzen */

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import TextComp from "../../../components/TextComp";
import axiosInstance from "../../../config/axios";
import { colors } from "../../../config/constants";
import { useAuth } from "../../../core/auth/auth";

function DialogPage() {
  const theme = useTheme();

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryColor, setCategoryColor] = useState("#F44E3B");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const { user } = useAuth();

  const addCategory = () => {
    setCategories([...categories, { name: newCategory, color: categoryColor }]);
    setNewCategory("");
    setCategoryColor("#FFFFFF");
    setOpenDialog(false);
  };

  const handleEditCategory = async () => {
    try {
      await axiosInstance.patch("/updateCategory", {
        id: editingCategory.id,
        name: newCategory,
        color: categoryColor,
      });
      // Update the local state to reflect the changes
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === editingCategory.id
            ? { ...category, name: newCategory, color: categoryColor }
            : category
        )
      );
      setOpenEditDialog(false);
      setNewCategory("");
      setCategoryColor("#FFFFFF");
      setSnackbarMessage("Kategorie erfolgreich gespeichert!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Error updating category:", error);
      setSnackbarMessage("Fehler beim speichern der Kategorie!");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
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

  const handleAddCategory = async (event) => {
    try {
      await axiosInstance.post("/saveCategory", {
        name: newCategory,
        user_id: user.id,
        color: categoryColor,
      });
      setSnackbarMessage("Kategorie erfolgreich hinzugefügt!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("category failed:", error);
      setSnackbarMessage("Fehler beim hinzufügen der Kategorie!");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axiosInstance.delete("/deleteCategory", {
        params: { id: categoryId },
      });
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
      setSnackbarMessage("Kategorie erfolgreich gelöscht!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Fehler beim Löschen der Kategorie:", error);
      setSnackbarMessage("Fehler beim löschen der Kategorie!");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
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
    <Card
      sx={{
        backgroundColor: theme.palette.card.main,
        boxShadow: theme.shadows[6],
        "&:hover": {
          boxShadow: theme.shadows[10],
        },
        height: "100%",
        marginTop: 2,
        marginRight: 4,
        marginBottom: 5,
      }}
    >
      <CardContent>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
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
                mb: 4,
              }}
            >
              Fügen Sie eine neue Kategorie hinzu und wählen Sie eine Farbe für
              sie.
            </DialogContentText>
            <InputLabel style={{ color: theme.palette.text.main, mt: 4 }}>
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
              onClick={() => setOpenDialog(false)}
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

        <Typography variant="h6" sx={{ mt: 2, color: theme.palette.text.main }}>
          Benutzerdefinierte Kategorien
        </Typography>
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
                mb: 4,
              }}
            >
              Kategorie <strong>{editingCategory?.name}</strong> bearbeiten
            </DialogContentText>
            <InputLabel style={{ color: theme.palette.text.main }}>
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

        <Button
          sx={{ marginTop: 3 }}
          onClick={() => setOpenDialog(true)}
          variant="contained"
        >
          Kategorie hinzufügen
        </Button>
      </CardContent>
    </Card>
  );
}

export default DialogPage;
