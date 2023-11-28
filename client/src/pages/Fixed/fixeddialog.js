import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import SelectComp from "../../components/SelectComp";
import TextComp from "../../components/TextComp";

function FixedDialog({
  openDialog,
  handleDialog,
  handleSubmit,
  theme,
  months,
  years,
  filterMonth,
  setFilterMonth,
  filterYear,
  setFilterYear,
  description,
  handleDescriptionChange,
  amount,
  handleAmountChange,
  transactionType,
  handleTransactionTypeChange,
  mode,
  setMode,
  startMonth,
  setStartMonth,
  endMonth,
  setEndMonth,
  startYear,
  setStartYear,
  endYear,
  setEndYear,
}) {
  return (
    <Grid item xs={12} md={8} lg={6}>
      <Dialog open={openDialog} onClose={handleDialog} fullWidth>
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.card.main,
            color: theme.palette.text.main,
            fontSize: "1.2rem", // Größere Schrift für den Titel
          }}
        >
          Neue Transaktion
        </DialogTitle>
        <DialogContent
          sx={{ backgroundColor: theme.palette.card.main, padding: "20px" }}
        >
          <FormControl>
            <RadioGroup
              row
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <FormControlLabel
                value="range"
                control={<Radio />}
                label="Zeitraum"
              />
              <FormControlLabel
                value="single"
                control={<Radio />}
                label="Einzelner Monat"
              />
            </RadioGroup>
          </FormControl>
          {mode === "single" ? (
            <>
              <InputLabel style={{ color: theme.palette.text.main }}>
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
              <InputLabel style={{ color: theme.palette.text.main }}>
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
              <InputLabel style={{ color: theme.palette.text.main }}>
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
                  <InputLabel style={{ color: theme.palette.text.main }}>
                    Monat
                  </InputLabel>
                  <FormControl fullWidth margin="normal">
                    <Select
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value)}
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
                  <InputLabel style={{ color: theme.palette.text.main }}>
                    Jahr
                  </InputLabel>
                  <FormControl fullWidth margin="normal">
                    <Select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
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
          ) : (
            <>
              <InputLabel style={{ color: theme.palette.text.main }}>
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
              <InputLabel style={{ color: theme.palette.text.main }}>
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
              <InputLabel style={{ color: theme.palette.text.main }}>
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
                  <InputLabel style={{ color: theme.palette.text.main }}>
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
                  <InputLabel style={{ color: theme.palette.text.main }}>
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
                  <InputLabel style={{ color: theme.palette.text.main }}>
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
                  <InputLabel style={{ color: theme.palette.text.main }}>
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
          )}
        </DialogContent>

        <DialogActions
          sx={{ backgroundColor: theme.palette.card.main, padding: "10px" }}
        >
          <Button onClick={handleDialog} color="secondary" variant="outlined">
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default FixedDialog;
