/* Copyright (c) 2026, Jason Oltzen */

import SavingsIcon from "@mui/icons-material/Savings";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

const MONTH_NAMES = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

const MonthlySaving = ({ savings, month }) => {
  const theme = useTheme();
  const accent = theme.palette.task.main;

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
          <SavingsIcon sx={{ fontSize: 14, color: accent }} />
          <Typography
            variant="caption"
            sx={{ color: accent, fontWeight: 700, letterSpacing: "0.06em" }}
          >
            Sparquote
          </Typography>
        </Box>
        <Tooltip title="Sparziele" placement="left">
          <IconButton
            href="/saving"
            size="small"
            sx={{
              backgroundColor: `${accent}22`,
              "&:hover": { backgroundColor: `${accent}44` },
            }}
          >
            <SavingsIcon sx={{ fontSize: 18, color: accent }} />
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
        {savings.toFixed(2)} €
      </Typography>

      <Typography
        variant="body2"
        sx={{ color: theme.palette.text.main, opacity: 0.5 }}
      >
        {MONTH_NAMES[month - 1]}
      </Typography>
    </Box>
  );
};

export default MonthlySaving;
