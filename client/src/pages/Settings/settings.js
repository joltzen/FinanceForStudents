import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../core/auth/auth";
import {
  FormControl,
  InputLabel,
  Button,
  Select,
  MenuItem,
  Box,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import StyledTableCell from "../../components/tablecell";
import DialogPage from "../Settings/dialog";
import DeleteIcon from "@mui/icons-material/Delete";
import Page from "../../components/page";

const StyledTextField = styled(TextField)({
  marginTop: "20px",
  "& label.Mui-focused": {
    color: "#e0e3e9",
  },
  "& label": {
    color: "#e0e3e9",
  },
  "& input": {
    color: "#e0e3e9",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#373c47",
    },
    "&:hover fieldset": {
      borderColor: "373c47",
    },
    "&.Mui-focused fieldset": {
      borderColor: "373c47",
    },
  },
  backgroundColor: "#2e2e38",
  borderRadius: "5px",
  border: "1px solid #e0e3e9",
});
function SettingsForm() {
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("Einnahme");
  const [transactions, setTransactions] = useState([]);

  const { user } = useAuth();

  const months = [
    { value: 1, label: "Januar" },
    { value: 2, label: "Februar" },
    { value: 3, label: "März" },
    { value: 4, label: "April" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Dezember" },
  ];

  const years = Array.from(
    { length: 10 },
    (_, index) => new Date().getFullYear() - index
  );

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
    try {
      const response = await axios.post(
        "http://localhost:3001/api/addSettings",
        {
          user_id: user.id,
          transactionType,
          amount,
          description,
          month: filterMonth,
          year: filterYear,
        }
      );
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        response.data.transaction,
      ]);
    } catch (error) {
      console.error("Settings failed:", error);
    }
    fetchSettings();
    setTransactionType(transactionType);
    setAmount("");
    setDescription("");
  };

  const handleDeleteSettings = async (settingsId) => {
    try {
      await axios.delete("http://localhost:3001/api/deleteSettings", {
        params: { id: settingsId },
      });
      setTransactions((prevTransactions) =>
        prevTransactions.filter(
          (transaction) => transaction.settings_id !== settingsId
        )
      );
    } catch (error) {
      console.error("Fehler beim Löschen der Settings:", error);
    }
  };
  const fetchSettings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/getSettings",
        {
          params: {
            month: filterMonth,
            year: filterYear,
            user_id: user.id,
          },
        }
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Fetching settings failed:", error);
    }
  };
  useEffect(() => {
    fetchSettings();
  }, [filterMonth, filterYear, user.id]);

  return (
    <Page>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mx: "auto",
          p: 2,
        }}
      >
        <Box sx={{ width: "50%" }}>
          <Typography variant="h4" sx={{ mb: 4, color: "#e0e3e9" }}>
            Fixkosten
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth>
              <InputLabel style={{ color: "#e0e3e9" }}>Fixkostentyp</InputLabel>
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
            <FormControl sx={{ marginTop: 3 }}>
              <InputLabel style={{ color: "#e0e3e9" }}>Monat</InputLabel>
              <Select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                label="Monat"
                sx={{
                  color: "#e0e3e9",
                  backgroundColor: "#2e2e38",
                  border: "1px solid #e0e3e9",
                }}
              >
                {months.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ marginLeft: 3, marginTop: 3 }}>
              <InputLabel style={{ color: "#e0e3e9" }}>Jahr</InputLabel>
              <Select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                label="Jahr"
                sx={{
                  color: "#e0e3e9",
                  backgroundColor: "#2e2e38",
                  border: "1px solid #e0e3e9",
                }}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <br />
            <br />
            <Button type="submit" variant="contained" color="button">
              Hinzufügen
            </Button>
          </form>
          <Box sx={{ width: "100%", marginTop: 10 }}>
            <DialogPage />
          </Box>
        </Box>
        <Box sx={{ width: "50%", marginLeft: 10 }}>
          <Box sx={{ mb: 5, marginRight: 10 }}>
            <Typography variant="h6" sx={{ color: "#e0e3e9" }}>
              Einnahmen
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell text="Beschreibung" />
                    <StyledTableCell text="Betrag" />
                    <StyledTableCell text=" " />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions
                    .filter(
                      (t) =>
                        t?.transaction_type === "Einnahme" &&
                        t?.month === filterMonth &&
                        t?.year === filterYear
                    )
                    .map((item) => (
                      <TableRow key={item.settings_id}>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ backgroundColor: "#e0e3e9" }}
                        >
                          {item.description}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ backgroundColor: "#e0e3e9" }}
                        >
                          {item.amount} €
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ backgroundColor: "#e0e3e9" }}
                        >
                          <IconButton
                            onClick={() =>
                              handleDeleteSettings(item.settings_id)
                            }
                            style={{ color: "black" }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{ marginRight: 10 }}>
            <Typography variant="h6" sx={{ color: "#e0e3e9" }}>
              Ausgaben
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell text="Beschreibung" />
                    <StyledTableCell text="Betrag" />
                    <StyledTableCell text="" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions
                    .filter(
                      (t) =>
                        t?.transaction_type === "Ausgabe" &&
                        t?.month === filterMonth &&
                        t?.year === filterYear
                    )
                    .map((item) => (
                      <TableRow key={item.settings_id}>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ backgroundColor: "#e0e3e9" }}
                        >
                          {item.description}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ backgroundColor: "#e0e3e9" }}
                        >
                          {item.amount} €
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ backgroundColor: "#e0e3e9" }}
                        >
                          <IconButton
                            onClick={() =>
                              handleDeleteSettings(item.settings_id)
                            }
                            style={{ color: "black" }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </Page>
  );
}

export default SettingsForm;
