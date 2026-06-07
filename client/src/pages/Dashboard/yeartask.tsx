/* Copyright (c) 2026, Jason Oltzen */
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

const YearlySaving = ({ savings }) => {
  const theme = useTheme();
  const accent = theme.palette.task.main;
  const text = theme.palette.text.main;

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
            JÄHRLICHE SPARQUOTE
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
            <SavingsOutlinedIcon sx={{ fontSize: 25, color: accent }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          mt: 2,
          mb: 0.75,
          color: theme.palette.text.main,
        }}
      >
        {savings.toFixed(2)} €
      </Typography>

      <Typography
        variant="body2"
        sx={{ color: theme.palette.text.main, opacity: 0.5 }}
      >
        Über alle Monate
      </Typography>
    </Box>
  );
};

export default YearlySaving;
