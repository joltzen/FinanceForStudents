import { useTheme } from "@emotion/react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { months, years } from "../../config/constants";

function EditSettingsDialog({ transaction, onClose, onSave }) {
  const [editedSettings, setEditedSettings] = useState({
    ...transaction,
  });
  const theme = useTheme();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSelectChange = (event) => {
    setEditedSettings({
      ...editedSettings,
      transaction_type: event.target.value,
    });
  };
  const handleMonthChange = (event) => {
    setEditedSettings({
      ...editedSettings,
      month: event.target.value,
    });
  };
  const handleYearChange = (event) => {
    setEditedSettings({
      ...editedSettings,
      year: event.target.value,
    });
  };

  const handleSave = () => {
    onSave(editedSettings);
    onClose();
  };

  return (
    <Dialog open={!!transaction} onClose={onClose} fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.card.main,
          color: theme.palette.text.main,
          fontSize: "1.2rem", // Größere Schrift für den Titel
        }}
      >
        Bearbeiten
      </DialogTitle>
      <DialogContent
        sx={{ backgroundColor: theme.palette.card.main, padding: "20px" }}
      >
        {/* Transaktionstyp */}
        <InputLabel style={{ color: theme.palette.text.main }}>
          Transaktionstyp
        </InputLabel>
        <FormControl fullWidth margin="normal">
          <Select
            value={editedSettings.transaction_type}
            onChange={handleSelectChange}
            sx={{
              color: theme.palette.text.main,
              height: "40px",
              ".MuiInputBase-input": {
                paddingTop: "5px",
                paddingBottom: "5px",
              },
              border: `1px solid ${theme.palette.text.main}`,
            }}
          >
            <MenuItem value="Ausgabe">Ausgabe</MenuItem>
            <MenuItem value="Einnahme">Einnahme</MenuItem>
          </Select>
        </FormControl>

        {/* Beschreibung */}
        <InputLabel style={{ color: theme.palette.text.main }}>
          Beschreibung
        </InputLabel>
        <TextField
          variant="outlined"
          fullWidth
          name="description"
          margin="normal"
          value={editedSettings.description}
          onChange={handleInputChange}
          sx={{
            ".MuiOutlinedInput-root": {
              height: "40px",
              border: `1px solid ${theme.palette.text.main}`,
            },
          }}
        />

        {/* Betrag */}
        <InputLabel style={{ color: theme.palette.text.main }}>
          Betrag
        </InputLabel>
        <TextField
          variant="outlined"
          fullWidth
          name="amount"
          margin="normal"
          type="number"
          value={editedSettings.amount}
          onChange={handleInputChange}
          sx={{
            ".MuiOutlinedInput-root": {
              height: "40px",
              border: `1px solid ${theme.palette.text.main}`,
            },
          }}
        />

        {/* Monat */}
        <InputLabel style={{ color: theme.palette.text.main }}>
          Monat
        </InputLabel>
        <FormControl fullWidth margin="normal">
          <Select
            value={editedSettings.month}
            onChange={handleMonthChange}
            sx={{
              color: theme.palette.text.main,
              height: "40px",
              ".MuiInputBase-input": {
                paddingTop: "5px",
                paddingBottom: "5px",
              },
              border: `1px solid ${theme.palette.text.main}`,
            }}
          >
            {months?.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Jahr */}
        <InputLabel style={{ color: theme.palette.text.main }}>Jahr</InputLabel>
        <FormControl fullWidth margin="normal">
          <Select
            value={editedSettings.year}
            onChange={handleYearChange}
            sx={{
              color: theme.palette.text.main,
              height: "40px",
              ".MuiInputBase-input": {
                paddingTop: "5px",
                paddingBottom: "5px",
              },
              border: `1px solid ${theme.palette.text.main}`,
            }}
          >
            {years?.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions
        sx={{ backgroundColor: theme.palette.card.main, padding: "10px" }}
      >
        <Button onClick={onClose} color="secondary" variant="outlined">
          Abbrechen
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditSettingsDialog;
