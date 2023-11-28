import BarChartIcon from "@mui/icons-material/BarChart";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import PaymentsIcon from "@mui/icons-material/Payments";
import SavingsIcon from "@mui/icons-material/Savings";
import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import DialogPage from "./dialog";

function NavigateCard({ theme, colorMode, totalBudget }) {
  return (
    <Grid item xs={12} sm={4} style={{ minHeight: "100%" }}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Card
            sx={{
              backgroundColor: theme.palette.card.main,
              boxShadow: theme.shadows[6],
              "&:hover": {
                boxShadow: theme.shadows[10],
              },
              height: "100%",
              marginRight: 4,
              minHeight: "100px",
              marginTop: 2,
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Box
                  sx={{
                    backgroundColor: theme.palette.monthly.main,
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    marginRight: 5,
                    marginLeft: 5,
                    top: theme.spacing(2),
                    right: theme.spacing(2),
                  }}
                >
                  <Tooltip title="Transaktionen verwalten" placement="left">
                    <IconButton href="/finance">
                      <PaymentsIcon
                        sx={{ color: theme.palette.common.white }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box
                  sx={{
                    backgroundColor: theme.palette.total.main,
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    marginRight: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    top: theme.spacing(2),
                    right: theme.spacing(2),
                  }}
                >
                  <Tooltip title="Dashboard" placement="left">
                    <IconButton href="/dashboard">
                      <BarChartIcon
                        sx={{ color: theme.palette.common.white }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    backgroundColor: theme.palette.task.main,
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    marginRight: 5,
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
                <Box
                  sx={{
                    backgroundColor: theme.palette.left.main,
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
                  <Tooltip title="Colormodus" placement="left">
                    {colorMode.mode}
                    <IconButton
                      onClick={colorMode.toggleColorMode}
                      color="inherit"
                    >
                      {theme.palette.mode === "dark" ? (
                        <DarkModeOutlinedIcon sx={{ color: "white" }} />
                      ) : (
                        <LightModeOutlinedIcon sx={{ color: "black" }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card
            sx={{
              backgroundColor: theme.palette.card.main,
              boxShadow: theme.shadows[6],
              "&:hover": {
                boxShadow: theme.shadows[10],
              },
              height: "100%",
              marginRight: 4,
            }}
          >
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ color: theme.palette.text.main }}
                  >
                    <strong>Gesamtbudget für diesen Monat:</strong>
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2 }}>
                    {totalBudget.toFixed(2)} €
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item>
          <Card
            sx={{
              backgroundColor: theme.palette.card.main,
              boxShadow: theme.shadows[6],
              "&:hover": {
                boxShadow: theme.shadows[10],
              },
              height: "100%",
              marginRight: 4,
              minHeight: "100px",
              marginTop: 2,
            }}
          >
            <CardContent>
              <DialogPage />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default NavigateCard;
