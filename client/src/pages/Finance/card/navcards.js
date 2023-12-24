import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BarChartIcon from "@mui/icons-material/BarChart";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import SavingsIcon from "@mui/icons-material/Savings";
import StarIcon from "@mui/icons-material/Star";
import { Box, Card, CardContent, IconButton, Tooltip } from "@mui/material";
import React from "react";

function NavCard({ theme, colorMode }) {
  return (
    <Card
      sx={{
        backgroundColor: theme.palette.card.main,
        boxShadow: theme.shadows[6],
        "&:hover": {
          boxShadow: theme.shadows[10],
        },
        height: "100%",
        marginRight: 2,
        minHeight: "100px",
        marginBottom: 1,
        borderRadius: 5,
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box
            sx={{
              backgroundColor: theme.palette.error.main,
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
            <Tooltip title="Fixkosten verwalten" placement="left">
              <IconButton href="/fixed">
                <AttachMoneyIcon sx={{ color: theme.palette.common.white }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box
            sx={{
              backgroundColor: theme.palette.favorites.main,
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
            <Tooltip title="Favoriten" placement="left">
              <IconButton href="/favorites">
                <StarIcon sx={{ color: theme.palette.common.white }} />
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
              <IconButton href="/">
                <BarChartIcon sx={{ color: theme.palette.common.white }} />
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
              <IconButton onClick={colorMode.toggleColorMode} color="inherit">
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
  );
}

export default NavCard;
