import React, { useState } from "react";
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
    color: "#d1d1d1", // Ein leicht dunklerer Farbton für den Text in den Textfeldern
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#d1d1d1", // Helle Border-Farbe
    },
    "&:hover fieldset": {
      borderColor: "white", // Helle Border-Farbe beim Hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
  backgroundColor: "#2c2f36",
});

function FinancePage() {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("Einnahme");

  const [error, setError] = useState("");
  const { user, logout } = useAuth();

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
      //Here, add your API endpoint to post the data
      const response = await axios.post(
        "http://localhost:3001/api/addTransaction",
        {
          date,
          description,
          amount,
          transactionType,
          user_id: user.id,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Transaction failed:", error);
      setError(
        error.response?.data?.message || "Failed transaction. Please try again."
      );
      // Handle error here (e.g., show error message)
    }
  };

  return (
    <Page>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // to take the full height of the viewport
          maxWidth: 400,
          mx: "auto",
        }}
      >
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <InputLabel style={{ color: "white" }}>Transaktionstyp</InputLabel>
            <Select
              value={transactionType}
              onChange={handleTransactionTypeChange}
              label="Transaktionstyp"
              style={{ color: "white" }}
            >
              <MenuItem value="Einnahme">Einnahme</MenuItem>
              <MenuItem value="Ausgabe">Ausgabe</MenuItem>
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
        </form>
      </Box>
    </Page>
  );
}

export default FinancePage;
