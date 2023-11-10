import React, { useState, useEffect } from "react";
import {
  TextField,
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
import { styled } from "@mui/system";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import FinanceOverview from "./overview";

const StyledTextField = styled(TextField)({
  marginTop: "20px",
  "& label.Mui-focused": {
    color: "#e0e3e9",
  },
  "& label": {
    color: "#e0e3e9",
  },
  "& input": {
    color: "#d1d1d1",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#d1d1d1",
    },
    "&:hover fieldset": {
      borderColor: "#e0e3e9",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#e0e3e9",
    },
  },
  backgroundColor: "#2e2e38",
});

const AddButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.primary.main),
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  position: "fixed",
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  [theme.breakpoints.up("sm")]: {
    right: theme.spacing(10),
  },
}));
function FinancePage() {
  const today = new Date().toISOString().split("T")[0];

  const [category, setCategory] = useState("");
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("Ausgabe");
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [error, setError] = useState("");
  const { user } = useAuth();

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
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
    setError("");
    try {
      const response = await axiosInstance.post("/addTransaction", {
        date,
        description,
        amount,
        transactionType,
        user_id: user.id,
        category_id: category,
      });
      setTransactions((transactions) => [
        ...transactions,
        response.data.transaction,
      ]);
      setAmount("");
      setDescription("");
      setDate(today);
      setTransactionType("Ausgabe");
      setCategory(categories[0].id);

      console.log(error);
    } catch (error) {
      console.error("Transaction failed:", error);
      setError(
        error.response?.data?.message || "Failed transaction. Please try again."
      );
    }
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
  }, [user.id]);

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: 20 }}
      >
        <Grid item xs={12} md={8} lg={6}>
          <AddButton
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleOpenDialog}
          >
            Transaktion hinzufügen
          </AddButton>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle sx={{ backgroundColor: "#262b3d", color: "#e0e3e9" }}>
              Neue Transaktion
            </DialogTitle>
            <DialogContent sx={{ backgroundColor: "#262b3d" }}>
              <form onSubmit={handleSubmit}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: "#e0e3e9" }}>
                    Transaktionstyp
                  </InputLabel>
                  <Select
                    value={transactionType}
                    onChange={handleTransactionTypeChange}
                    label="Transaktionstyp"
                    sx={{
                      color: "#e0e3e9",
                      backgroundColor: "#2e2e38",
                      border: "1px solid #e0e3e9",
                    }}
                  >
                    <MenuItem value="Ausgabe">Ausgabe</MenuItem>
                    <MenuItem value="Einnahme">Einnahme</MenuItem>
                  </Select>
                </FormControl>
                <StyledTextField
                  label="Betrag"
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  fullWidth
                  required
                />
                <StyledTextField
                  label="Beschreibung"
                  type="text"
                  value={description}
                  onChange={handleDescriptionChange}
                  fullWidth
                  required
                />
                <StyledTextField
                  fullWidth
                  label="Datum"
                  name="date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={date}
                  onChange={handleDateChange}
                />
                <InputLabel
                  sx={{ color: "#e0e3e9", mt: 2 }}
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
                    color: "#e0e3e9",
                    backgroundColor: getCurrentCategoryColor(),
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
                      sx={{ backgroundColor: cat.color }}
                    >
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </form>
            </DialogContent>
            <DialogActions sx={{ backgroundColor: "#262b3d" }}>
              <Button
                onClick={handleCloseDialog}
                color="primary"
                sx={{ color: "#e0e3e9" }}
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleSubmit}
                color="primary"
                sx={{ color: "#e0e3e9" }}
              >
                Speichern
              </Button>
            </DialogActions>
          </Dialog>

          <Typography variant="h6" color="#e0e3e9" sx={{ mb: 2 }}>
            Transaktionen Übersicht
          </Typography>
          <FinanceOverview />
        </Grid>
      </Grid>
    </Box>
  );
}

export default FinancePage;
