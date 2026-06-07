import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
export function Rangedialog({
  transactionType,
  handleTransactionTypeChange,
  description,
  handleDescriptionChange,
  amount,
  handleAmountChange,
  startMonth,
  setStartMonth,
  months,
  startYear,
  setStartYear,
  years,
  endMonth,
  setEndMonth,
  endYear,
  setEndYear,
  theme,
}) {
  return (
    <>
      <InputLabel
        style={{
          color: theme.palette.text.main,
        }}
      >
        Transaktionstyp
      </InputLabel>
      <FormControl fullWidth margin="normal">
        <Select
          value={transactionType}
          onChange={handleTransactionTypeChange}
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
      <InputLabel
        style={{
          color: theme.palette.text.main,
        }}
      >
        Beschreibung
      </InputLabel>
      <TextField
        variant="outlined"
        fullWidth
        name="description"
        margin="normal"
        value={description}
        onChange={handleDescriptionChange}
        sx={{
          ".MuiOutlinedInput-root": {
            height: "40px",
            border: `1px solid ${theme.palette.text.main}`,
          },
        }}
      />

      {/* Betrag */}
      <InputLabel
        style={{
          color: theme.palette.text.main,
        }}
      >
        Betrag
      </InputLabel>
      <TextField
        variant="outlined"
        fullWidth
        name="amount"
        margin="normal"
        type="number"
        value={amount}
        onChange={handleAmountChange}
        sx={{
          ".MuiOutlinedInput-root": {
            height: "40px",
            border: `1px solid ${theme.palette.text.main}`,
          },
        }}
      />
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          {/* Monat */}
          <InputLabel
            style={{
              color: theme.palette.text.main,
            }}
          >
            Startmonat
          </InputLabel>
          <FormControl fullWidth margin="normal">
            <Select
              value={startMonth}
              onChange={(e) => setStartMonth(e.target.value)}
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
        </Grid>
        <Grid item xs={6}>
          {/* Jahr */}
          <InputLabel
            style={{
              color: theme.palette.text.main,
            }}
          >
            Startjahr
          </InputLabel>
          <FormControl fullWidth margin="normal">
            <Select
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
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
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          {/* Monat */}
          <InputLabel
            style={{
              color: theme.palette.text.main,
            }}
          >
            Endmonat
          </InputLabel>
          <FormControl fullWidth margin="normal">
            <Select
              value={endMonth}
              onChange={(e) => setEndMonth(e.target.value)}
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
        </Grid>
        <Grid item xs={6}>
          {/* Jahr */}
          <InputLabel
            style={{
              color: theme.palette.text.main,
            }}
          >
            Endjahr
          </InputLabel>
          <FormControl fullWidth margin="normal">
            <Select
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
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
        </Grid>
      </Grid>
    </>
  );
}
