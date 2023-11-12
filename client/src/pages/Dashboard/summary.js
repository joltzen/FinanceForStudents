import React from "react";
import { Typography, Grid } from "@mui/material";

const BudgetSummary = ({ isAnnualView, totalRemaining }) => {
  return (
    <Grid item xs={12}>
      <Typography variant="subtitle1" sx={{ color: "#e0e3e9", mt: 2 }}>
        <strong>
          {isAnnualView ? "Gesamtes Jahresbudget: " : "Verbleibendes Budget: "}
        </strong>
        {totalRemaining.toFixed(2)} €
      </Typography>
    </Grid>
  );
};

export default BudgetSummary;
