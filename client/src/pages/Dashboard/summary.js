/* Copyright (c) 2023, Jason Oltzen */

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

const BudgetSummary = ({ isAnnualView, totalRemaining, percentageChange }) => {
  const theme = useTheme();
  const accent = theme.palette.error.main;

  return (
    <Box sx={{ p: 0.5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box
          sx={{
            backgroundColor: `${accent}22`,
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <AttachMoneyIcon sx={{ fontSize: 14, color: accent }} />
          <Typography variant="caption" sx={{ color: accent, fontWeight: 700, letterSpacing: "0.06em" }}>
            {isAnnualView ? "Jahresbudget" : "Monatsbudget"}
          </Typography>
        </Box>
        <Tooltip title="Fixkosten verwalten" placement="left">
          <IconButton
            href="/fixed"
            size="small"
            sx={{
              backgroundColor: `${accent}22`,
              "&:hover": { backgroundColor: `${accent}44` },
            }}
          >
            <AttachMoneyIcon sx={{ fontSize: 18, color: accent }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Typography
        variant="h3"
        sx={{ fontWeight: 700, mt: 2.5, mb: 0.5, color: theme.palette.text.main }}
      >
        {totalRemaining.toFixed(2)} €
      </Typography>

      {!isAnnualView && (
        <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 0.5 }}>
          {percentageChange < 0 ? (
            <ArrowDownwardIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
          ) : (
            <ArrowUpwardIcon sx={{ fontSize: 16, color: theme.palette.success.main }} />
          )}
          <Typography
            variant="body2"
            sx={{
              color: percentageChange < 0 ? theme.palette.error.main : theme.palette.success.main,
              fontWeight: 600,
            }}
          >
            {percentageChange.toFixed(1)}% seit letztem Monat
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BudgetSummary;
