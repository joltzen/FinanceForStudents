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
  Select,
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
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={2}>
            <Typography
              sx={{ color: theme.palette.text.main, marginTop: 9, mr: 2 }}
            >
              Von:
            </Typography>
          </Grid>

          <Grid item xs={5}>
            <InputLabel sx={{ color: theme.palette.text.main, mt: 3 }}>
              Monat
            </InputLabel>
            <FormControl fullWidth sx={{ marginTop: 1 }}>
              <Select
                value={sourceMonth}
                onChange={(e) => setSourceMonth(e.target.value)}
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

          <Grid item xs={5}>
            <InputLabel sx={{ color: theme.palette.text.main, mt: 3, ml: 2 }}>
              Jahr
            </InputLabel>
            <FormControl
              fullWidth
              sx={{ marginLeft: 2, marginTop: 1, marginBottom: 3 }}
            >
              <Select
                value={sourceYear}
                onChange={(e) => setSourceYear(e.target.value)}
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

          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Typography
                sx={{ color: theme.palette.text.main, marginTop: 9, ml: 2 }}
              >
                Nach:
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <InputLabel sx={{ color: theme.palette.text.main, mt: 3, ml: 1 }}>
                Monat
              </InputLabel>
              <FormControl fullWidth sx={{ marginTop: 1 }}>
                <Select
                  value={targetMonth}
                  onChange={(e) => setTargetMonth(e.target.value)}
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
            <Grid item xs={5}>
              <InputLabel sx={{ color: theme.palette.text.main, mt: 3, ml: 2 }}>
                Jahr
              </InputLabel>
              <FormControl
                fullWidth
                sx={{ marginLeft: 2, marginTop: 1, marginBottom: 3 }}
              >
                <Select
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
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
