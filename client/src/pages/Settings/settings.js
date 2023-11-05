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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { styled } from "@mui/system";
import StyledTableCell from "../../components/tablecell";
import Circle from "@uiw/react-color-circle";

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
function SettingsForm() {
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("Einnahme");
  const [transactions, setTransactions] = useState([]);
  const [name, setName] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryColor, setCategoryColor] = useState("#F44E3B");
  const [openDialog, setOpenDialog] = useState(false);
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
  useEffect(() => {
    // Asynchrone Funktion, um Kategorien abzurufen
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
        // Hier könnten Sie Fehlermeldungen im UI anzeigen oder ähnliche Aktionen ausführen
      }
    };

    fetchCategories();
  }, [user.id]); // Abhängigkeiten des Effekts, in diesem Fall die user_id

  // Funktion zum Hinzufügen einer neuen Kategorie
  const addCategory = () => {
    setCategories([...categories, { name: newCategory, color: categoryColor }]);
    setNewCategory("");
    setCategoryColor("#FFFFFF");
    setOpenDialog(false);
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

  // Funktion zum Speichern der Daten
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/saveSettings",
        {
          user_id: user.id,
          // Zusätzlich Monat und Jahr übergeben
        }
      );
      // Weiterer Code für Erfolgsfeedback
    } catch (error) {
      // Fehlerbehandlung
    }
  };
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
      // Weiterer Code für Erfolgsfeedback
    } catch (error) {
      console.error("category failed:", error);
    }
  };

  const fixkostenEinnahmen = [
    { id: 1, description: "Gehalt", amount: 3000 },
    // ... andere Fixkosten Einnahmen
  ];

  const fixkostenAusgaben = [
    { id: 1, description: "Miete", amount: 1000 },
    // ... andere Fixkosten Ausgaben
  ];
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: "100vh",
          mx: "auto",
          p: 2,
        }}
      >
        <Box sx={{ width: "33%" }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Fixkosten
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth>
              <InputLabel style={{ color: "white" }}>Fixkostentyp</InputLabel>
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
            <FormControl sx={{ marginTop: 3 }}>
              <InputLabel style={{ color: "white" }}>Monat</InputLabel>
              <Select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                label="Monat"
                style={{ color: "white" }}
              >
                {months.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ marginLeft: 3, marginTop: 3 }}>
              <InputLabel style={{ color: "white" }}>Jahr</InputLabel>
              <Select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                label="Monat"
                style={{ color: "white" }}
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
            <Button type="submit" variant="contained" color="primary">
              Hinzufügen
            </Button>
          </form>
        </Box>
        <Box sx={{ width: "33%", marginLeft: 10 }}>
          <Box sx={{ mb: 5, marginRight: 10 }}>
            <Typography variant="h6">Einnahmen</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell text="Beschreibung" />
                    <StyledTableCell text="Betrag" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fixkostenEinnahmen.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell component="th" scope="row">
                        {item.description}
                      </TableCell>
                      <TableCell align="right">{item.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{ marginRight: 10 }}>
            <Typography variant="h6">Ausgaben</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell text="Beschreibung" />
                    <StyledTableCell text="Betrag" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fixkostenAusgaben.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell component="th" scope="row">
                        {item.description}
                      </TableCell>
                      <TableCell align="right">{item.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
        <Box sx={{ width: "33%" }}>
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
                  Fügen Sie eine neue Kategorie hinzu und wählen Sie eine Farbe
                  für sie.
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

            {/* Liste der benutzerdefinierten Kategorien */}
            <Typography variant="h6" sx={{ mt: 2 }}>
              Benutzerdefinierte Kategorien
            </Typography>
            {categories.map((category, index) => (
              <Paper
                key={index}
                style={{
                  backgroundColor: category.color,
                  padding: "10px",
                  marginTop: "10px",
                }}
              >
                <Typography>{category.name}</Typography>
              </Paper>
            ))}
          </div>
        </Box>
      </Box>
    </div>
  );
}

export default SettingsForm;
