import React from "react";
import { Paper, Typography, Grid, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const BudgetSummary = ({ isAnnualView, totalRemaining, percentageChange }) => {
  const theme = useTheme();

  return (
    <Grid item xs={12}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ color: theme.palette.text.secondary }}
          >
            {isAnnualView ? "JAHRESBUDET" : "MONATSBUDGET"}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2 }}>
            {totalRemaining.toFixed(2)} €
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            color={theme.palette.success.main}
            sx={{ mt: 2 }}
          >
            <ArrowUpwardIcon fontSize="medium" color="white" />
            <Typography variant="subtitle2" sx={{ ml: 0.5 }}>
              <strong>{percentageChange.toFixed(2)}% Seit letztem Monat</strong>
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: theme.palette.error.main,
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: theme.spacing(2),
            right: theme.spacing(2),
          }}
        >
          <AttachMoneyIcon sx={{ color: theme.palette.common.white }} />
        </Box>
      </Box>
    </Grid>
  );
};

export default BudgetSummary;
