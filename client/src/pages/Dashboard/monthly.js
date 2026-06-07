/* Copyright (c) 2026, Jason Oltzen */

import PaymentsIcon from "@mui/icons-material/Payments";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

const MonthlyExpenses = ({ expenses }) => {
  const theme = useTheme();
  const accent = theme.palette.monthly.main;

  return (
    <Box sx={{ p: 0.5 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
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
          <PaymentsIcon sx={{ fontSize: 14, color: accent }} />
          <Typography
            variant="caption"
            sx={{ color: accent, fontWeight: 700, letterSpacing: "0.06em" }}
          >
            Monatsausgaben
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
            <PaymentsIcon sx={{ fontSize: 18, color: accent }} />
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
        {expenses.toFixed(2)} €
      </Typography>

      <Typography
        variant="body2"
        sx={{ color: theme.palette.text.main, opacity: 0.5 }}
      >
        Aktueller Monat
      </Typography>
    </Box>
  );
};

export default MonthlyExpenses;
