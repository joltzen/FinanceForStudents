import React, { useContext } from "react";
import { Typography, Grid, Box, IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { ColorModeContext } from "../../theme";

const TotalSavings = ({ total }) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext); // Access the color mode context

  return (
    <Grid item xs={12}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ color: theme.palette.text.main }}
          >
            {"GESAMT GESPART"}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2 }}>
            {total.toFixed(2)} €
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: theme.palette.total.main,
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
          <Tooltip title="Colormode" placement="left">
            <IconButton onClick={colorMode.toggleColorMode}>
              <ShowChartIcon sx={{ color: theme.palette.common.white }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Grid>
  );
};

export default TotalSavings;
