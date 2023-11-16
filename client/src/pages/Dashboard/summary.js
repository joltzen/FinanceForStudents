import React from "react";
import { Typography, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const BudgetSummary = ({ isAnnualView, totalRemaining }) => {
  const theme = useTheme();
  return (
    <Grid item xs={12}>
      <Typography
        variant="subtitle1"
        sx={{ color: theme.palette.text.main, mt: 2 }}
      >
        <strong>
          {isAnnualView ? "Gesamtes Jahresbudget: " : "Verbleibendes Budget: "}
        </strong>
        {totalRemaining.toFixed(2)} €
      </Typography>
    </Grid>
  );
};

export default BudgetSummary;
