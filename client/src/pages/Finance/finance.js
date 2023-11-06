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
import Page from "../../components/page";
import { styled } from "@mui/system";
import axios from "axios";
import { useAuth } from "../../core/auth/auth";
import FinanceOverview from "./overview";
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:3001/api/addTransaction",
        {
          date,
          description,
          amount,
          transactionType,
          user_id: user.id,
          category_id: category,
        }
      );
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

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          height: "100vh",
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
              <InputLabel style={{ color: "white" }}>
                Transaktionstyp
              </InputLabel>
              <Select
                value={transactionType}
                onChange={handleTransactionTypeChange}
                label="Transaktionstyp"
                style={{ color: "white" }}
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
            <Button type="submit" variant="contained" color="primary">
              Hinzufügen
            </Button>
            <InputLabel
              sx={{ color: "white", marginTop: 2 }}
              id="category-label"
            >
              Kategorie
            </InputLabel>
            <Select
              labelId="category-label"
              value={category}
              defaultValue={categories}
              onChange={(e) => setCategory(e.target.value)}
              label="Kategorie"
              style={{ color: "white", backgroundColor: category.color }}
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
