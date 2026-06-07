/* Copyright (c) 2026, Jason Oltzen */

import BarChartIcon from "@mui/icons-material/BarChart";
import { Box, Button, Typography } from "@mui/material";
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
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          backgroundColor: isDark
            ? "rgba(198,170,96,0.1)"
            : "rgba(78,87,123,0.08)",
        }}
      >
        <BarChartIcon
          sx={{
            fontSize: 32,
            color: isDark ? "rgba(198,170,96,0.5)" : "rgba(78,87,123,0.4)",
          }}
        />
      </Box>
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.main,
          fontWeight: 600,
          mb: 0.5,
          textAlign: "center",
        }}
      >
        Keine Daten vorhanden
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.main,
          opacity: 0.45,
          mb: 3,
          textAlign: "center",
          maxWidth: 280,
        }}
      >
        Für den ausgewählten Zeitraum sind keine Budgetdaten vorhanden.
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button
          href="/fixed"
          size="small"
          variant="outlined"
          sx={{
            borderColor: isDark
              ? "rgba(198,170,96,0.4)"
              : "rgba(78,87,123,0.3)",
            color: isDark ? "#c6aa60" : theme.palette.primary.main,
            borderRadius: 2,
          }}
        >
          Fixkosten verwalten
        </Button>
        <Button
          href="/finance"
          size="small"
          variant="outlined"
          sx={{
            borderColor: isDark
              ? "rgba(198,170,96,0.4)"
              : "rgba(78,87,123,0.3)",
            color: isDark ? "#c6aa60" : theme.palette.primary.main,
            borderRadius: 2,
          }}
        >
          Transaktionen hinzufügen
        </Button>
      </Box>
    </Box>
  );
};

export default NoDataAlert;
