/* Copyright (c) 2026, Jason Oltzen */

import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

const BudgetSummary = ({ isAnnualView, totalRemaining, percentageChange }) => {
  const theme = useTheme();
  //use slate blue for both monthly and annual to keep it consistent, since it's more of a "budget" color than a "monthly/annual" color
  const accent = theme.palette.text.main;

  return (
    <Box sx={{ p: 0.5 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box
          sx={{
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: accent, fontWeight: 700, letterSpacing: "0.06em" }}
          >
            {isAnnualView ? "JAHRESBUDGET" : "MONATSBUDGET"}
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
            <AttachMoneyIcon sx={{ fontSize: 25, color: accent }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          mt: 2.5,
          mb: 0.5,
          color: theme.palette.text.main,
        }}
      >
        € {totalRemaining.toFixed(2)}
      </Typography>

      {!isAnnualView && (
        <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 0.5 }}>
          {percentageChange < 0 ? (
            <TrendingDownIcon
              sx={{ fontSize: 16, color: theme.palette.error.main }}
            />
          ) : (
            <TrendingUpIcon
              sx={{ fontSize: 16, color: theme.palette.success.main }}
            />
          )}
          <Typography
            variant="body2"
            sx={{
              color:
                percentageChange < 0
                  ? theme.palette.error.main
                  : theme.palette.success.main,
              fontWeight: 600,
            }}
          >
            {percentageChange.toFixed(1)}% vs. Vormonat
          </Typography>
        </Box>
      )}
    </Box>
  );
};;;;;;;;;;

export default BudgetSummary;
