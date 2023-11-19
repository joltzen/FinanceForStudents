/* Copyright (c) 2023, Jason Oltzen */

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Box, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

const BudgetSummary = ({ isAnnualView, totalRemaining, percentageChange }) => {
  const theme = useTheme();

  return (
    <Grid item xs={12}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ color: theme.palette.text.main }}
          >
            {isAnnualView ? "JAHRESBUDET" : "MONATSBUDGET"}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2 }}>
            {totalRemaining.toFixed(2)} €
          </Typography>
          {isAnnualView ? (
            <></>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              color={
                percentageChange < 0
                  ? theme.palette.error.main
                  : theme.palette.success.main
              }
              sx={{ mt: 2 }}
            >
              {percentageChange < 0 ? (
                <ArrowDownwardIcon fontSize="medium" />
              ) : (
                <ArrowUpwardIcon fontSize="medium" />
              )}
              <Typography variant="subtitle2" sx={{ ml: 0.5 }}>
                <strong>
                  {percentageChange.toFixed(2)}% Seit letztem Monat
                </strong>
              </Typography>
            </Box>
          )}
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
            top: theme.spacing(2),
            right: theme.spacing(2),
          }}
        >
          <Tooltip title="Fixkosten verwalten" placement="left">
            <IconButton href="/settings">
              <AttachMoneyIcon sx={{ color: theme.palette.common.white }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Grid>
  );
};

export default BudgetSummary;
