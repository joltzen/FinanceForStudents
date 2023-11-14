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

function TransferDialog({ open, handleClose, handleSubmit, months, years }) {
  const [sourceMonth, setSourceMonth] = useState(new Date().getMonth());
  const [sourceYear, setSourceYear] = useState(new Date().getFullYear());
  const [targetMonth, setTargetMonth] = useState(new Date().getMonth() + 1);
  const [targetYear, setTargetYear] = useState(new Date().getFullYear());

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ backgroundColor: "#262b3d", color: "#e0e3e9" }}>
        Fixkosten übertragen
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: "#262b3d", color: "#e0e3e9" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography sx={{ color: "#e0e3e9", marginTop: 3 }}>
              Von:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ marginTop: 1 }}>
              <InputLabel style={{ color: "#e0e3e9" }}>Monat</InputLabel>
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
              <InputLabel style={{ color: "#e0e3e9" }}>Jahr</InputLabel>
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
            <Typography sx={{ color: "#e0e3e9", marginTop: 3 }}>
              Nach:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ marginTop: 1 }}>
              <InputLabel style={{ color: "#e0e3e9" }}>Monat</InputLabel>
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
              <InputLabel style={{ color: "#e0e3e9" }}>Jahr</InputLabel>
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
      <DialogActions sx={{ backgroundColor: "#262b3d", color: "#e0e3e9" }}>
        <Button sx={{ color: "#e0e3e9" }} onClick={handleClose}>
          Cancel
        </Button>
        <Button
          sx={{ color: "#e0e3e9" }}
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
