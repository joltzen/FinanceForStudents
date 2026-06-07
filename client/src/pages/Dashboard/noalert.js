/* Copyright (c) 2026, Jason Oltzen */

import BarChartIcon from "@mui/icons-material/BarChart";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

const NoDataAlert = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        px: 2,
        borderRadius: 3,
        backgroundColor: isDark ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.04)",
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          backgroundColor: isDark ? "rgba(198,170,96,0.1)" : "rgba(78,87,123,0.08)",
        }}
      >
        <BarChartIcon
          sx={{
            fontSize: 28,
            color: isDark ? "rgba(198,170,96,0.5)" : "rgba(78,87,123,0.4)",
          }}
        />
      </Box>
      <Typography
        variant="body1"
        sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 0.5, textAlign: "center" }}
      >
        Keine aktuellen Daten
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.primary,
          opacity: 0.45,
          textAlign: "center",
          maxWidth: 280,
        }}
      >
        Verknüpfe dein Bankkonto oder füge Transaktionen manuell hinzu, um Trends zu sehen.
      </Typography>
    </Box>
  );
};

export default NoDataAlert;
