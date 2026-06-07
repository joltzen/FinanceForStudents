/* Copyright (c) 2026, Jason Oltzen */

import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";

const TotalSavings = ({ total, savingsGoalCount }) => {
  const theme = useTheme();
  const accent = theme.palette.total.main;
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
            GESAMT GESPART
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
        sx={{ fontWeight: 700, mt: 2, mb: 0.5, color: theme.palette.text.main }}
      >
        € {total.toFixed(2)}
      </Typography>

      <Typography
        variant="body2"
        sx={{ color: theme.palette.text.main, opacity: 0.5 }}
      >
        {savingsGoalCount > 0
          ? `Auf ${savingsGoalCount} Sparziel${savingsGoalCount === 1 ? "" : "e"} verteilt`
          : "Über alle Monate"}
      </Typography>
    </Box>
  );
};

export default TotalSavings;
