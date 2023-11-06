import React from "react";
import { Grid } from "@mui/material";
import FinanceOverview from "./FinanceOverview";
import FinancePage from "./FinancePage";

function CombinedFinanceComponent() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <FinanceOverview />
      </Grid>
      <Grid item xs={12} md={6}>
        <FinancePage />
      </Grid>
    </Grid>
  );
}

export default CombinedFinanceComponent;
