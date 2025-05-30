/* Copyright (c) 2023, Jason Oltzen */

import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

const NoDataAlert = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        height: "100px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ color: theme.palette.text.main, mb: 2, textAlign: "center" }}
      >
        Für den ausgewählten Zeitraum sind keine Budgetdaten vorhanden.
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          href="/fixed"
          sx={{ mr: 5, color: theme.palette.text.main }}
        >
          Fixkosten verwalten
        </Button>
        <Button
          type="submit"
          variant="contained"
          href="/fixed"
          sx={{ color: theme.palette.text.main }}
        >
          Ein und Ausgaben verwalten
        </Button>
      </Box>
    </Box>
  );
};

export default NoDataAlert;
