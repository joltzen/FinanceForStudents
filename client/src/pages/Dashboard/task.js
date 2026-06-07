/* Copyright (c) 2026, Jason Oltzen */

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PercentIcon from "@mui/icons-material/Percent";
import { Box, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

const MONTH_NAMES = [
  "Januar","Februar","März","April","Mai","Juni",
  "Juli","August","September","Oktober","November","Dezember",
];

const MonthlySaving = ({ savings, month, savingsRate }) => {
  const theme = useTheme();
  const accent = theme.palette.task.main;
  const text = theme.palette.text.main;
  const goalMet = savingsRate !== undefined && savingsRate >= 20;

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
            SPARQUOTE
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
            <PercentIcon sx={{ fontSize: 25, color: accent }} />
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
        {savingsRate !== undefined
          ? `${savingsRate.toFixed(1)}%`
          : `${savings.toFixed(2)} €`}
      </Typography>

      {goalMet ? (
        <Chip
          icon={<CheckCircleOutlineIcon sx={{ fontSize: "14px !important" }} />}
          label="Ziel erreicht"
          size="small"
          sx={{
            backgroundColor: `${theme.palette.success.main}22`,
            color: theme.palette.success.main,
            fontWeight: 600,
            fontSize: "0.75rem",
            height: 22,
          }}
        />
      ) : (
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.main, opacity: 0.5 }}
        >
          {MONTH_NAMES[(month ?? 1) - 1]}
        </Typography>
      )}
    </Box>
  );
};

export default MonthlySaving;
