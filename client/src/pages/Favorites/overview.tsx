/* Copyright (c) 2026, Jason Oltzen */

import Add from "@mui/icons-material/Add";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BarChartIcon from "@mui/icons-material/BarChart";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import PaymentsIcon from "@mui/icons-material/Payments";
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
import { useAuth } from "../../core/auth/auth";
import {
  deleteFavorite,
  getCategories,
  getFavorites,
  updateFavorite,
} from "../../services/db";
import { ColorModeContext } from "../../theme";
import AddCategory from "./addcategory";
import DialogPage from "./dialog";
import EditTransactionDialog from "./edit";
import TransactionsTable from "./table";

function FavoritesOverview({ update, handleOpenDialog, triggerUpdate }) {
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();
  const [sortOrderAmount, setSortOrderAmount] = useState("desc");
  const [activeSorting, setActiveSorting] = useState("date");
  const [isCategoryWarningOpen, setIsCategoryWarningOpen] = useState(false);
  const [editFavorites, setEditFavorites] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setCategories(await getCategories(user.id));
    } catch (error) {
      console.error("Fehler beim Laden der Kategorien:", error);
    }
  }, [user.id]);

  const fetchFavorites = useCallback(async () => {
    try {
      setFavorites(await getFavorites(user.id));
    } catch (error) {
      console.error("Fehler beim Laden der Favoriten:", error);
    }
  }, [user.id]);

  const handleAddFavorites = async () => {
    await fetchCategories();
    if (categories.length === 0) {
      setIsCategoryWarningOpen(true);
    } else {
      handleOpenDialog();
    }
  };

  useEffect(() => {
    fetchFavorites();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id, update, activeSorting]);

  const handleDeleteFavorites = async (favoritesId) => {
    try {
      await deleteFavorite(user.id, favoritesId);
      setFavorites((prev) =>
        prev.filter((f) => f.favorites_id !== favoritesId),
      );
    } catch (error) {
      console.error("Fehler beim Löschen der Favoriten:", error);
    }
  };

  const handleEditFavorites = async (fav) => {
    try {
      await updateFavorite(user.id, fav.favorites_id, {
        amount: fav.amount,
        description: fav.description,
        transaction_type: fav.transaction_type,
        category_id: fav.category_id,
      });
      fetchFavorites();
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

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
                    hier Favoriten anlegen.
                  </Typography>
                </Typography>
                <IconButton
                  onClick={handleAddFavorites}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    boxShadow: 5,
                  }}
                >
                  <Tooltip
                    sx={{ color: theme.palette.text.main }}
                    title="Favorit hinzufügen"
                  >
                    <Add sx={{ color: theme.palette.common.white }} />
                  </Tooltip>
                </IconButton>
              </Box>
              <TransactionsTable
                toggleSortOrderAmount={() => {
                  setActiveSorting("amount");
                  setSortOrderAmount(
                    sortOrderAmount === "asc" ? "desc" : "asc",
                  );
                }}
                sortOrderAmount={sortOrderAmount}
                finalFavorites={favorites}
                categories={categories}
                handleEditButtonClick={(fav) => setEditFavorites(fav)}
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
                height: "100%",
                marginRight: 4,
                minHeight: "100px",
                marginTop: 2,
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="center" alignItems="center">
                  {[
                    {
                      href: "/fixed",
                      icon: <AttachMoneyIcon sx={{ color: "white" }} />,
                      color: theme.palette.error.main,
                      title: "Fixkosten",
                    },
                    {
                      href: "/finance",
                      icon: <PaymentsIcon sx={{ color: "white" }} />,
                      color: theme.palette.monthly?.main,
                      title: "Transaktionen",
                    },
                    {
                      href: "/",
                      icon: <BarChartIcon sx={{ color: "white" }} />,
                      color: theme.palette.total?.main,
                      title: "Dashboard",
                    },
                    {
                      href: "/saving",
                      icon: <SavingsIcon sx={{ color: "white" }} />,
                      color: theme.palette.task?.main,
                      title: "Sparziele",
                    },
                  ].map(({ href, icon, color, title }) => (
                    <Box
                      key={href}
                      sx={{
                        backgroundColor: color,
                        borderRadius: "50%",
                        width: "50px",
                        height: "50px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        marginRight: 5,
                        top: theme.spacing(2),
                        right: theme.spacing(2),
                      }}
                    >
                      <Tooltip title={title} placement="left">
                        <IconButton href={href}>{icon}</IconButton>
                      </Tooltip>
                    </Box>
                  ))}
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
      >
        <DialogTitle>Kategorie erforderlich</DialogTitle>
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
            isCategoryWarningOpen={isCategoryWarningOpen}
            handleCategoryAdded={() => setIsCategoryWarningOpen(false)}
            onCategoryAdded={triggerUpdate}
          />
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default FavoritesOverview;
