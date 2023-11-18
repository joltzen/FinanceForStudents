import React from "react";
import { Typography, Grid, Box, Tooltip, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SavingsIcon from "@mui/icons-material/Savings";

const MonthlySaving = ({ savings, month }) => {
  const theme = useTheme();

  const getMonthName = (month) => {
    const monthNames = [
      "JANUAR",
      "FEBRUAR",
      "MÄRZ",
      "APRIL",
      "MAI",
      "JUNI",
      "JULI",
      "AUGUST",
      "SEPTEMBER",
      "OKTOBER",
      "NOVEMBER",
      "DEZEMBER",
    ];
    return monthNames[month];
  };

  return (
    <Grid item xs={12}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ color: theme.palette.text.main }}
          >
            {"MONATLICHE SPAARQUOTE " + getMonthName(month - 1)}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2 }}>
            {savings.toFixed(2)} €
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: theme.palette.task.main,
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            top: theme.spacing(2),
            right: theme.spacing(2),
          }}
        >
          <Tooltip title="Sparziele" placement="left">
            <IconButton href="/saving">
              <SavingsIcon sx={{ color: theme.palette.common.white }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Grid>
  );
};

export default MonthlySaving;
