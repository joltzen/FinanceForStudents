// NoDataAlert.js
import React from "react";
import { Box, Typography, Button } from "@mui/material";

const NoDataAlert = () => {
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
        sx={{ color: "#e0e3e9", mb: 2, textAlign: "center" }}
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
          color="button"
          href="/settings"
          sx={{ mr: 5, color: "#e0e3e9" }}
        >
          Fixkosten verwalten
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="button"
          href="/settings"
          sx={{ color: "#e0e3e9" }}
        >
          Ein und Ausgaben verwalten
        </Button>
      </Box>
    </Box>
  );
};

export default NoDataAlert;
