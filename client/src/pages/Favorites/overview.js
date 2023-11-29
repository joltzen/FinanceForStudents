/* Copyright (c) 2023, Jason Oltzen */

import Add from "@mui/icons-material/Add";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BarChartIcon from "@mui/icons-material/BarChart";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import SavingsIcon from "@mui/icons-material/Savings";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/system";
import React, { useCallback, useContext, useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import { ColorModeContext } from "../../theme";
import AddCategory from "./addcategory";
import DialogPage from "./dialog";
import EditTransactionDialog from "./edit";
import FilterTransactions from "./filter";
import TransactionsTable from "./table";
function FavoritesOverview({ update, handleOpenDialog, triggerUpdate }) {
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortOrderAmount, setSortOrderAmount] = useState("desc");
  const [sortedByAmountTransactions, setSortedByAmountFavorites] = useState([]);
  const [activeSorting, setActiveSorting] = useState("date");
  const [isCategoryWarningOpen, setIsCategoryWarningOpen] = useState(false);

  const handleAddFavorites = () => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/getCategories", {
          params: { user_id: user.id },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Kategorien:", error);
      }
    };

    fetchCategories();
    if (categories.length === 0) {
      setIsCategoryWarningOpen(true); // Öffnet den Dialog
    } else {
      handleOpenDialog(); // Fährt fort mit dem Hinzufügen einer Transaktion
    }
  };

  const handleCategoryAdded = () => {
    setIsCategoryWarningOpen(false);
  };

  useEffect(() => {
    let sortedFavorites = [...favorites];
    if (activeSorting === "amount") {
      sortedFavorites.sort((a, b) => {
        const amountA = parseFloat(a.amount);
        const amountB = parseFloat(b.amount);

        const adjustedAmountA =
          a.transaction_type === "Ausgabe" ? -amountA : amountA;
        const adjustedAmountB =
          b.transaction_type === "Ausgabe" ? -amountB : amountB;

        return sortOrderAmount === "asc"
          ? adjustedAmountA - adjustedAmountB
          : adjustedAmountB - adjustedAmountA;
      });
      setSortedByAmountFavorites(sortedFavorites);
    }
  }, [sortOrder, sortOrderAmount, favorites, user.id, update, activeSorting]);

  const toggleSortOrderAmount = () => {
    setActiveSorting("amount");
    setSortOrderAmount(sortOrderAmount === "asc" ? "desc" : "asc");
  };

  const fetchFavorites = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/getFavorites", {
        params: {
          user_id: user.id,
        },
      });
      setFavorites(response.data);
    } catch (error) {
      console.error("Fehler beim Laden der Favoriten:", error);
    }
  }, [favorites, categories, user.id]);

  const handleDeleteFavorites = async (favoritesId) => {
    try {
      await axiosInstance.delete("/deleteFavorites", {
        params: { id: favoritesId },
      });
      setFavorites((prevFavorites) =>
        prevFavorites.filter(
          (favorites) => favorites.favorites_id !== favoritesId
        )
      );
    } catch (error) {
      console.error("Fehler beim Löschen der Favoriten:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/getCategories", {
          params: { user_id: user.id },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Kategorien:", error);
      }
    };

    fetchCategories();
  }, [sortOrder, sortOrderAmount, user.id, update, activeSorting]);
  const [editFavorites, setEditFavorites] = useState(null);
  const handleEditFavorites = async (favorites) => {
    try {
      await axiosInstance.patch("/updateFavorites", favorites);
      //fetchTransactions();
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const handleEditButtonClick = (favorites) => {
    setEditFavorites(favorites);
  };

  const theme = useTheme();
  const colorMode = useContext(ColorModeContext); // Access the color mode context

  return (
    <Grid container spacing={4} style={{ minHeight: "100vh" }}>
      <Grid item xs={12} sm={8} md={6} lg={8} style={{ minHeight: "100%" }}>
        <Card
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: theme.palette.left.main,
          }}
        >
          <CardContent
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 10,
              height: "100%",
            }}
          >
            <Box component="form" noValidate sx={{ mt: 4, width: "100%" }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 2, mb: 4, width: "100%" }}
              >
                <Typography variant="h4" color={theme.palette.text.main}>
                  Favoriten
                  <Typography
                    variant="subtitle1"
                    color={theme.palette.text.main}
                  >
                    Hast du regelmäßige Einnahmen und Ausgaben? Dann kannst du
                    hier Favoriten anlegen, um diese schneller hinzuzufügen.
                  </Typography>
                </Typography>

                <IconButton
                  variant="contained"
                  onClick={handleAddFavorites}
                  sx={{
                    backgroundColor: theme.palette.primary.main,

                    boxShadow: 5,
                  }}
                >
                  <Tooltip
                    sx={{ color: theme.palette.text.main }}
                    title="Transaktion hinzufügen"
                  >
                    <Add sx={{ color: theme.palette.common.white }} />
                  </Tooltip>
                </IconButton>
              </Box>
              <TransactionsTable
                toggleSortOrderAmount={toggleSortOrderAmount}
                sortOrderAmount={sortOrderAmount}
                finalFavorites={favorites}
                categories={categories}
                handleEditButtonClick={handleEditButtonClick}
                handleDeleteTransaction={handleDeleteFavorites}
              />
            </Box>

            {editFavorites && (
              <EditTransactionDialog
                favorites={editFavorites}
                onClose={() => setEditFavorites(null)}
                onSave={handleEditFavorites}
                categories={categories}
              />
            )}
          </CardContent>
        </Card>
      </Grid>
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
                        <AttachMoneyIcon
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
                      <IconButton href="/">
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
                        <SavingsIcon
                          sx={{ color: theme.palette.common.white }}
                        />
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
                marginTop: 2,
                marginRight: 4,
                marginBottom: 5,
              }}
            >
              <CardContent>
                <DialogPage onCategoryChange={triggerUpdate} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={isCategoryWarningOpen}
        onClose={() => setIsCategoryWarningOpen(false)}
        aria-labelledby="category-warning-dialog-title"
      >
        <DialogTitle id="category-warning-dialog-title">
          Kategorie erforderlich
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bitte legen Sie zuerst mindestens eine Kategorie an.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsCategoryWarningOpen(false)}
            variant="contained"
          >
            Abbrechen
          </Button>
          <AddCategory
            setCategoryWarningOpen={isCategoryWarningOpen}
            handleCategoryAdded={handleCategoryAdded}
            onCategoryAdded={triggerUpdate}
          />
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default FavoritesOverview;
