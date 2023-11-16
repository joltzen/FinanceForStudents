import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import SelectComp from "../../components/SelectComp";
import { useTheme } from "@mui/material/styles";

function TransferDialog({ open, handleClose, handleSubmit, months, years }) {
  const [sourceMonth, setSourceMonth] = useState(new Date().getMonth());
  const [sourceYear, setSourceYear] = useState(new Date().getFullYear());
  const [targetMonth, setTargetMonth] = useState(new Date().getMonth() + 1);
  const [targetYear, setTargetYear] = useState(new Date().getFullYear());
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.card.main,
          color: theme.palette.text.main,
        }}
      >
        Fixkosten übertragen
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: theme.palette.card.main,
          color: theme.palette.text.main,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography sx={{ color: theme.palette.text.main, marginTop: 3 }}>
              Von:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ marginTop: 1 }}>
              <InputLabel style={{ color: theme.palette.text.main }}>
                Monat
              </InputLabel>
              <SelectComp
                value={sourceMonth}
                onChange={(e) => setSourceMonth(e.target.value)}
                label="Monat"
              >
                {months?.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </SelectComp>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl
              fullWidth
              sx={{ marginLeft: 2, marginTop: 1, marginBottom: 3 }}
            >
              <InputLabel style={{ color: theme.palette.text.main }}>
                Jahr
              </InputLabel>
              <SelectComp
                value={sourceYear}
                onChange={(e) => setSourceYear(e.target.value)}
                label="Jahr"
              >
                {years?.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </SelectComp>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ color: theme.palette.text.main, marginTop: 3 }}>
              Nach:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ marginTop: 1 }}>
              <InputLabel style={{ color: theme.palette.text.main }}>
                Monat
              </InputLabel>
              <SelectComp
                value={targetMonth}
                onChange={(e) => setTargetMonth(e.target.value)}
                label="Monat"
              >
                {months?.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </SelectComp>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl
              fullWidth
              sx={{ marginLeft: 2, marginTop: 1, marginBottom: 3 }}
            >
              <InputLabel style={{ color: theme.palette.text.main }}>
                Jahr
              </InputLabel>
              <SelectComp
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                label="Jahr"
              >
                {years?.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </SelectComp>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: theme.palette.card.main,
          color: theme.palette.text.main,
        }}
      >
        <Button sx={{ color: theme.palette.text.main }} onClick={handleClose}>
          Cancel
        </Button>
        <Button
          sx={{ color: theme.palette.text.main }}
          onClick={() =>
            handleSubmit(sourceMonth, sourceYear, targetMonth, targetYear)
          }
        >
          Transfer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TransferDialog;
