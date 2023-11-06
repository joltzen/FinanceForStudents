import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Typography,
  Paper,
  TextField,
  IconButton,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../core/auth/auth";
import { styled } from "@mui/system";
import Circle from "@uiw/react-color-circle";
import DeleteIcon from "@mui/icons-material/Delete";

function DialogPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryColor, setCategoryColor] = useState("#F44E3B");
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useAuth();

  const StyledTextField = styled(TextField)({
    marginTop: "20px",
    "& label.Mui-focused": {
      color: "white",
    },
    "& label": {
      color: "white",
    },
    "& input": {
      color: "#d1d1d1",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#d1d1d1",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
    },
    backgroundColor: "#2c2f36",
  });

  const addCategory = () => {
    setCategories([...categories, { name: newCategory, color: categoryColor }]);
    setNewCategory("");
    setCategoryColor("#FFFFFF");
    setOpenDialog(false);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/getCategories",
          {
            params: { user_id: user.id },
          }
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Kategorien:", error);
      }
    };

    fetchCategories();
  }, [user.id]);

  const handleAddCategory = async (event) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/saveCategory",
        {
          name: newCategory,
          user_id: user.id,
          color: categoryColor,
        }
      );
      console.log(response);
    } catch (error) {
      console.error("category failed:", error);
    }
  };

  const handleUpdateCategory = async (categoryToUpdate) => {
    try {
      const response = await axios.patch(
        "http://localhost:3001/api/updateCategory",
        categoryToUpdate
      );
      const updatedCategory = response.data;
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === updatedCategory.id ? updatedCategory : category
        )
      );
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Kategorie:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete("http://localhost:3001/api/deleteCategory", {
        params: { id: categoryId },
      });
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
    } catch (error) {
      console.error("Fehler beim Löschen der Kategorie:", error);
    }
  };

  return (
    <div>
      <Button
        sx={{ marginTop: 2 }}
        onClick={() => setOpenDialog(true)}
        variant="contained"
        color="primary"
      >
        Kategorie hinzufügen
      </Button>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Neue Kategorie hinzufügen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fügen Sie eine neue Kategorie hinzu und wählen Sie eine Farbe für
            sie.
          </DialogContentText>
          <StyledTextField
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
            colors={[
              "#F44336",
              "#E91E63",
              "#9C27B0",
              "#673AB7",
              "#3F51B5",
              "#2196F3",
              "#03A9F4",
              "#00BCD4",
              "#009688",
              "#4CAF50",
              "#8BC34A",
              "#CDDC39",
              "#FFEB3B",
              "#FFC107",
              "#FF9800",
              "#FF5722",
              "#795548",
              "#607D8B",
            ]}
            color={categoryColor}
            onChange={(color) => {
              setCategoryColor(color.hex);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Abbrechen
          </Button>
          <Button
            onClick={() => {
              addCategory();
              handleAddCategory();
            }}
            color="primary"
          >
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Benutzerdefinierte Kategorien
      </Typography>
      {categories.map((category, index) => (
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
          <Typography>{category.name}</Typography>

          <IconButton
            onClick={() => handleDeleteCategory(category.id)}
            style={{ color: "black" }}
          >
            <DeleteIcon />
          </IconButton>
        </Paper>
      ))}
    </div>
  );
}

export default DialogPage;
