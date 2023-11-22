/* Copyright (c) 2023, Jason Oltzen */

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BarChartIcon from "@mui/icons-material/BarChart";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import SavingsIcon from "@mui/icons-material/Savings";
import AddIcon from "@mui/icons-material/Add";
import EastIcon from "@mui/icons-material/East";
import { ColorModeContext } from "../../theme";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useContext, useEffect, useRef, useState } from "react";
import SelectComp from "../../components/SelectComp";
import Page from "../../components/page";
import axiosInstance from "../../config/axios";
import { months, years } from "../../config/constants";
import { useAuth } from "../../core/auth/auth";
import DialogPage from "../Settings/dialog";
import TransactionSection from "./transactionselect";
import TransferDialog from "./transerdialog";
import FixedDialog from "./fixeddialog";
import EditSettingsDialog from "./edit";
function SettingsForm() {
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("Einnahme");
  const [transactions, setTransactions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const { user } = useAuth();
  const theme = useTheme();
  const descriptionInputRef = useRef(null);
  const colorMode = useContext(ColorModeContext); // Access the color mode context

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleTransferDialogOpen = () => {
    setOpenTransferDialog(true);
  };

  const handleTransferDialogClose = () => {
    setOpenTransferDialog(false);
  };

  const postTransactions = async (transactions) => {
    try {
      for (let transaction of transactions) {
        if (!transaction.transaction_type) {
          console.error(
            "Transaction type is missing for a transaction:",
            transaction
          );
          continue;
        }

        await axiosInstance.post("/addSettings", {
          ...transaction,
          user_id: user.id,
          transactionType: transaction.transaction_type,
        });
      }
    } catch (error) {
      console.error("Error posting transactions:", error);
    }
  };
  useEffect(() => {
    if (openDialog) {
      descriptionInputRef.current?.focus();
    }
  }, [openDialog]);
  const handleTransferSubmit = async (
    sourceMonth,
    sourceYear,
    targetMonth,
    targetYear
  ) => {
    try {
      // Fetch source transactions
      const sourceResponse = await axiosInstance.get("/getSettings", {
        params: { month: sourceMonth, year: sourceYear, user_id: user.id },
      });
      const sourceTransactions = await sourceResponse.data;

      // Fetch target transactions
      const targetResponse = await axiosInstance.get("/getSettings", {
        params: { month: targetMonth, year: targetYear, user_id: user.id },
      });
      const targetTransactions = await targetResponse.data;

      // Filter out transactions that are already present in the target month and year
      const transactionsToTransfer = sourceTransactions.filter(
        (sourceTransaction) => {
          return !targetTransactions.some((targetTransaction) => {
            return (
              targetTransaction.description === sourceTransaction.description &&
              targetTransaction.amount === sourceTransaction.amount &&
              targetTransaction.transaction_type ===
                sourceTransaction.transaction_type
            );
          });
        }
      );

      // Map transactions to target month and year
      const mappedTransactions = transactionsToTransfer.map((transaction) => ({
        ...transaction,
        month: targetMonth,
        year: targetYear,
      }));

      // Post the filtered transactions
      await postTransactions(mappedTransactions);
      handleTransferDialogClose();
      fetchSettings();
    } catch (error) {
      console.error("Fetching settings failed:", error);
    }
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleTransactionTypeChange = (e) => {
    setTransactionType(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post("/addSettings", {
        user_id: user.id,
        transactionType,
        amount,
        description,
        month: filterMonth,
        year: filterYear,
      });
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        response.data.transaction,
      ]);
    } catch (error) {
      console.error("Settings failed:", error);
    }
    fetchSettings();
    setTransactionType(transactionType);
    setAmount("");
    setDescription("");
  };

  const handleDeleteSettings = async (settingsId) => {
    try {
      await axiosInstance.delete("/deleteSettings", {
        params: { id: settingsId },
      });
      setTransactions((prevTransactions) =>
        prevTransactions.filter(
          (transaction) => transaction.settings_id !== settingsId
        )
      );
    } catch (error) {
      console.error("Fehler beim Löschen der Settings:", error);
    }
  };
  const fetchSettings = async () => {
    try {
      const response = await axiosInstance.get("/getSettings", {
        params: {
          month: filterMonth,
          year: filterYear,
          user_id: user.id,
        },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Fetching settings failed:", error);
    }
  };
  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterMonth, filterYear, user.id]);

  const [editSettings, setEditSettings] = useState(null);

  const handleEditSettings = async (transaction) => {
    try {
      await axiosInstance.patch("/updateSettings", transaction);
      fetchSettings();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleEditButtonClick = (transactionId) => {
    const transactionToEdit = transactions.find(
      (t) => t.settings_id === transactionId
    );
    if (transactionToEdit) {
      setEditSettings(transactionToEdit);
    }
  };

  //calculate total budget for the month
  const totalBudget = transactions?.reduce(
    (total, transaction) =>
      transaction?.transaction_type === "Einnahme"
        ? total + parseFloat(transaction?.amount)
        : total - parseFloat(transaction?.amount),
    0
  );

  return (
    <Page>
      <FixedDialog
        openDialog={openDialog}
        handleDialog={handleDialog}
        handleSubmit={handleSubmit}
        theme={theme}
        months={months}
        years={years}
        filterMonth={filterMonth}
        setFilterMonth={setFilterMonth}
        filterYear={filterYear}
        setFilterYear={setFilterYear}
        description={description}
        handleDescriptionChange={handleDescriptionChange}
        amount={amount}
        handleAmountChange={handleAmountChange}
        transactionType={transactionType}
        handleTransactionTypeChange={handleTransactionTypeChange}
      />

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
              <Typography variant="h4" color={theme.palette.text.main}>
                Fixkosten
              </Typography>

              <Box sx={{ width: "100%", marginTop: 2 }}></Box>
              <Box sx={{ width: "100%", marginTop: 3, marginBottom: 20 }}>
                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  aria-label="Income and Expenses Tabs"
                  variant="fullWidth"
                  sx={{
                    backgroundColor: theme.palette.list.main,
                    color: theme.palette.text.main,
                    ".MuiTabs-indicator": {
                      backgroundColor: theme.palette.indicator.main,
                    },
                    borderRadius: "50px",
                    marginBottom: 2,
                    ".MuiTab-root": {
                      color: theme.palette.text.main,
                      fontWeight: "bold",
                      marginRight: 2,
                      "&.Mui-selected": {
                        color: theme.palette.indicator.main,
                        borderBottom: `2px solid ${theme.palette.selected.main}`,
                      },
                    },
                  }}
                >
                  <Tab label="Einnahmen" />
                  <Tab label="Ausgaben" />
                </Tabs>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center", // Aligns items vertically
                    marginTop: 3,
                    marginBottom: 3,
                  }}
                >
                  <FormControl sx={{ marginRight: 3, flexGrow: 1 }}>
                    <InputLabel style={{ color: theme.palette.text.main }}>
                      Monat
                    </InputLabel>
                    <SelectComp
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value)}
                      label="Monat"
                    >
                      {months?.map((month) => (
                        <MenuItem key={month.value} value={month.value}>
                          {month.label}
                        </MenuItem>
                      ))}
                    </SelectComp>
                  </FormControl>

                  <FormControl sx={{ marginRight: 3, flexGrow: 1 }}>
                    <InputLabel style={{ color: theme.palette.text.main }}>
                      Jahr
                    </InputLabel>
                    <SelectComp
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      label="Jahr"
                    >
                      {years?.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </SelectComp>
                  </FormControl>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      flexGrow: 0,
                    }}
                  >
                    <IconButton
                      variant="contained"
                      onClick={handleTransferDialogOpen}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        boxShadow: 5,
                      }}
                    >
                      <Tooltip title="Fixkosten übertragen">
                        <EastIcon sx={{ color: theme.palette.common.white }} />
                      </Tooltip>
                    </IconButton>

                    <IconButton
                      variant="contained"
                      onClick={handleDialog}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        boxShadow: 5,
                        marginLeft: 3,
                      }}
                    >
                      <Tooltip title="Fixkosten hinzufügen">
                        <AddIcon sx={{ color: theme.palette.common.white }} />
                      </Tooltip>
                    </IconButton>
                  </Box>
                </Box>
                <TransferDialog
                  open={openTransferDialog}
                  handleClose={handleTransferDialogClose}
                  handleSubmit={handleTransferSubmit}
                  months={months}
                  years={years}
                />
                {selectedTab === 0 && (
                  <TransactionSection
                    transactions={transactions}
                    filterMonth={filterMonth}
                    filterYear={filterYear}
                    handleDeleteSettings={handleDeleteSettings}
                    handleEditButtonClick={handleEditButtonClick}
                    transactionType="Einnahme"
                  />
                )}
                {selectedTab === 1 && (
                  <TransactionSection
                    transactions={transactions}
                    filterMonth={filterMonth}
                    filterYear={filterYear}
                    handleDeleteSettings={handleDeleteSettings}
                    handleEditButtonClick={handleEditButtonClick}
                    transactionType="Ausgabe"
                  />
                )}
              </Box>
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
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
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
                        <IconButton href="/settings">
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
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", mt: 2 }}
                      >
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
      </Grid>
      {editSettings && (
        <EditSettingsDialog
          transaction={editSettings}
          onClose={() => setEditSettings(null)}
          onSave={handleEditSettings}
        />
      )}
    </Page>
  );
}

export default SettingsForm;
