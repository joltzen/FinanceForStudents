/* Copyright (c) 2023, Jason Oltzen */

import PaymentsIcon from "@mui/icons-material/Payments";
import { Box, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

const MonthlyExpenses = ({ expenses }) => {
  const theme = useTheme();

  return (
    <Grid item xs={12}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ color: theme.palette.text.main }}
          >
            {"MONATSAUSGABEN"}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2 }}>
            {expenses.toFixed(2)} €
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: theme.palette.monthly.main,
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            top: theme.spacing(2),
            right: theme.spacing(2),
          }}
        >
          <Tooltip title="Finanzverwaltung" placement="left">
            <IconButton href="/finance">
              <PaymentsIcon sx={{ color: theme.palette.common.white }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Grid>
  );
};

export default MonthlyExpenses;
