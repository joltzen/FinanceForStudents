import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";
import { Rangedialog } from "./rangedialog";
import { Singledialog } from "./singledialog";

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
                control={
                  <Radio
                    sx={{
                      color: theme.palette.primary.main,
                      "&.Mui-checked": { color: theme.palette.secondary.main },
                    }}
                  />
                }
                label="Zeitraum"
              />
              <FormControlLabel
                value="single"
                control={
                  <Radio
                    sx={{
                      color: theme.palette.primary.main,
                      "&.Mui-checked": { color: theme.palette.secondary.main },
                    }}
                  />
                }
                label="Einzelner Monat"
              />
            </RadioGroup>
          </FormControl>
          {mode === "single" ? (
            <Singledialog
              transactionType={transactionType}
              handleTransactionTypeChange={handleTransactionTypeChange}
              description={description}
              handleDescriptionChange={handleDescriptionChange}
              amount={amount}
              handleAmountChange={handleAmountChange}
              filterMonth={filterMonth}
              setFilterMonth={setFilterMonth}
              months={months}
              filterYear={filterYear}
              setFilterYear={setFilterYear}
              years={years}
              theme={theme}
            />
          ) : (
            <Rangedialog
              transactionType={transactionType}
              handleTransactionTypeChange={handleTransactionTypeChange}
              description={description}
              handleDescriptionChange={handleDescriptionChange}
              amount={amount}
              handleAmountChange={handleAmountChange}
              startMonth={startMonth}
              theme={theme}
              setStartMonth={setStartMonth}
              months={months}
              startYear={startYear}
              setStartYear={setStartYear}
              years={years}
              endMonth={endMonth}
              setEndMonth={setEndMonth}
              endYear={endYear}
              setEndYear={setEndYear}
            />
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
