import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
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

function FinancePage() {
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("Ausgabe");
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [error, setError] = useState("");
  const { user } = useAuth();

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
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        response.data.transaction,
      ]);
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
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          mx: "auto",
          p: 2,
        }}
      >
        <Box
          sx={{
            flex: 1,
            maxWidth: "33%",
            p: 2,
            marginRight: "100px",
          }}
        >
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
            <br />
            <StyledTextField
              label="Beschreibung"
              type="text"
              value={description}
              onChange={handleDescriptionChange}
              fullWidth
              required
            />
            <StyledTextField
              label="Datum"
              type="date"
              value={date}
              onChange={handleDateChange}
              fullWidth
              required
              InputProps={{
                inputProps: { step: 300 },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br />
            <br />
            <Button type="submit" variant="contained" color="button">
              Hinzufügen
            </Button>
            <InputLabel
              sx={{ color: "#e0e3e9", marginTop: 2 }}
              id="category-label"
            >
              Kategorie
            </InputLabel>
            <Select
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
        </Box>
        <Box
          sx={{
            flex: 1,
            maxWidth: "66%",
            p: 2,
          }}
        >
          <FinanceOverview />
        </Box>
      </Box>
    </div>
  );
}

export default FinancePage;
