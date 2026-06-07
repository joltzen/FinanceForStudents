/* Copyright (c) 2026, Jason Oltzen */

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import {
  Box,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

const MonthlyExpenses = ({ expenses, budgetTotal }) => {
  const theme = useTheme();
  const accent = theme.palette.error.main;
  const text = theme.palette.text.main;
  const percentUsed = budgetTotal > 0 ? Math.min((expenses / budgetTotal) * 100, 100) : 0;

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
            sx={{ color: text, fontWeight: 700, letterSpacing: "0.06em" }}
          >
            MONATSAUSGABEN
          </Typography>
        </Box>
        <Tooltip title="Finanzverwaltung" placement="left">
          <IconButton
            href="/finance"
            size="small"
            sx={{
              backgroundColor: `${accent}22`,
              "&:hover": { backgroundColor: `${accent}44` },
            }}
          >
            <ShoppingCartOutlinedIcon sx={{ fontSize: 25, color: accent }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Typography
        variant="h3"
        sx={{ fontWeight: 700, mt: 2, mb: 1, color: theme.palette.text.main }}
      >
        € {expenses.toFixed(2)}
      </Typography>

      {budgetTotal > 0 ? (
        <Box>
          <LinearProgress
            variant="determinate"
            value={percentUsed}
            sx={{
              height: 4,
              borderRadius: 2,
              mb: 0.75,
              backgroundColor: `${accent}22`,
              "& .MuiLinearProgress-bar": {
                backgroundColor:
                  percentUsed > 90 ? theme.palette.error.main : accent,
                borderRadius: 2,
              },
            }}
          />
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.main, opacity: 0.5 }}
          >
            {percentUsed.toFixed(0)}% des Budgets verbraucht
          </Typography>
        </Box>
      ) : (
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.main, opacity: 0.5 }}
        >
          Aktueller Monat
        </Typography>
      )}
    </Box>
  );
};

export default MonthlyExpenses;
