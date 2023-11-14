import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
} from "@mui/material";
import SelectComp from "../../components/SelectComp";

function TransferDialog({ open, handleClose, handleSubmit, months, years }) {
  const [sourceMonth, setSourceMonth] = useState(new Date().getMonth() + 1);
  const [sourceYear, setSourceYear] = useState(new Date().getFullYear());
  const [targetMonth, setTargetMonth] = useState(new Date().getMonth() + 1);
  const [targetYear, setTargetYear] = useState(new Date().getFullYear());

  // ... Logic for handling transfer

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ backgroundColor: "#262b3d", color: "#e0e3e9" }}>
        Fixkosten übertragen
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: "#262b3d", color: "#e0e3e9" }}>
        <FormControl sx={{ marginTop: 3 }}>
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
        <FormControl sx={{ marginLeft: 3, marginTop: 3, marginBottom: 3 }}>
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
        <FormControl sx={{ marginTop: 3, ml: 4 }}>
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
        <FormControl sx={{ marginLeft: 3, marginTop: 3, marginBottom: 3 }}>
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
