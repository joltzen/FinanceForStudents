/* Copyright (c) 2023, Jason Oltzen */

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useContext } from "react";
import { ColorModeContext } from "../../theme";

const TotalSavings = ({ total }) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const accent = theme.palette.total.main;

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
          <ShowChartIcon sx={{ fontSize: 14, color: accent }} />
          <Typography variant="caption" sx={{ color: accent, fontWeight: 700, letterSpacing: "0.06em" }}>
            Gesamt gespart
          </Typography>
        </Box>
        <Tooltip title="Dark/Light Mode" placement="left">
          <IconButton
            onClick={colorMode.toggleColorMode}
            size="small"
            sx={{
              backgroundColor: `${accent}22`,
              "&:hover": { backgroundColor: `${accent}44` },
            }}
          >
            {theme.palette.mode === "dark"
              ? <DarkModeOutlinedIcon sx={{ fontSize: 18, color: accent }} />
              : <LightModeOutlinedIcon sx={{ fontSize: 18, color: accent }} />}
          </IconButton>
        </Tooltip>
      </Box>

      <Typography
        variant="h3"
        sx={{ fontWeight: 700, mt: 2.5, mb: 0.5, color: theme.palette.text.main }}
      >
        {total.toFixed(2)} €
      </Typography>

      <Typography variant="body2" sx={{ color: theme.palette.text.main, opacity: 0.5 }}>
        Über alle Monate
      </Typography>
    </Box>
  );
};

export default TotalSavings;
