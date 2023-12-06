/* Copyright (c) 2023, Jason Oltzen */

import { Alert, Grid, Snackbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useContext, useEffect, useRef, useState } from "react";
import axiosInstance from "../../config/axios";
import { months, years } from "../../config/constants";
import { useAuth } from "../../core/auth/auth";
import { ColorModeContext } from "../../theme";
import NavigateCard from "./cards";
import EditSettingsDialog from "./edit";
import FilterCard from "./fixed_manager";
import FixedDialog from "./Dialog/fixeddialog";

function FixedForm() {
  // Contexts and refs
  const { user } = useAuth();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const descriptionInputRef = useRef(null);

  // Form states
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("Einnahme");

  // Filter states
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [filterMonth, setFilterMonth] = useState(currentMonth);
  const [filterYear, setFilterYear] = useState(currentYear);

  // Transaction states
  const [transactions, setTransactions] = useState([]);
  const [editSettings, setEditSettings] = useState(null);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Range states
  const [startMonth, setStartMonth] = useState(currentMonth - 1);
  const [endMonth, setEndMonth] = useState(currentMonth);
  const [startYear, setStartYear] = useState(currentYear);
  const [endYear, setEndYear] = useState(currentYear);
  const [mode, setMode] = useState("range");

  // Tab states
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (openDialog) {
      descriptionInputRef.current?.focus();
    }
  }, [openDialog]);

  useEffect(() => {
    fetchSettings();
  }, [filterMonth, filterYear, user.id]);

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

  const handleTransferSubmit = async (
    sourceMonth,
    sourceYear,
    targetMonth,
    targetYear
  ) => {
    try {
      const sourceResponse = await axiosInstance.get("/getSettings", {
        params: { month: sourceMonth, year: sourceYear, user_id: user.id },
      });
      const sourceTransactions = await sourceResponse.data;

      const targetResponse = await axiosInstance.get("/getSettings", {
        params: { month: targetMonth, year: targetYear, user_id: user.id },
      });
      const targetTransactions = await targetResponse.data;

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

      const mappedTransactions = transactionsToTransfer.map((transaction) => ({
        ...transaction,
        month: targetMonth,
        year: targetYear,
      }));

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
      if (mode === "range") {
        for (let year = startYear; year <= endYear; year++) {
          const startM = year === startYear ? startMonth : 1;
          const endM = year === endYear ? endMonth : 12;

          for (let month = startM; month <= endM; month++) {
            await axiosInstance.post("/addSettings", {
              user_id: user.id,
              transactionType,
              amount,
              description,
              month,
              year,
            });
          }
        }
      } else {
        await axiosInstance.post("/addSettings", {
          user_id: user.id,
          transactionType,
          amount,
          description,
          month: filterMonth,
          year: filterYear,
        });
      }

      setSnackbarMessage("Fixkosten wurden erfolgreich hinzugefügt!");
      setSnackbarSeverity("success");
      fetchSettings();
      setTransactionType(transactionType);
      setAmount("");
      setDescription("");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error posting settings:", error);
      setSnackbarMessage("Fehler beim Hinzufügen der Fixkosten!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
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
      setSnackbarMessage("Fixkosten wurden erfolgreich gelöscht!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Fehler beim Löschen der Settings:", error);
      setSnackbarMessage("Fehler beim löschen der Fixkosten!");
    }
    setSnackbarOpen(true);
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

  const handleEditSettings = async (transaction) => {
    try {
      await axiosInstance.patch("/updateSettings", transaction);
      fetchSettings();
      setSnackbarMessage("Fixkosten erfolgreich gespeichert!");
    } catch (error) {
      console.error("Error updating transaction:", error);
      setSnackbarMessage("Fehler beim speichern der Fixkosten!");
    }
    setSnackbarOpen(true);
  };

  const handleEditButtonClick = (transactionId) => {
    const transactionToEdit = transactions.find(
      (t) => t.settings_id === transactionId
    );
    if (transactionToEdit) {
      setEditSettings(transactionToEdit);
    }
  };

  const totalBudget = transactions?.reduce(
    (total, transaction) =>
      transaction?.transaction_type === "Einnahme"
        ? total + parseFloat(transaction?.amount)
        : total - parseFloat(transaction?.amount),
    0
  );

  const handleMonthChange = (direction) => {
    let newMonth = filterMonth + (direction === "next" ? 1 : -1);
    let newYear = filterYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }

    setFilterMonth(newMonth);
    setFilterYear(newYear);
  };

  return (
    <div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
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
        mode={mode}
        setMode={setMode}
        startMonth={startMonth}
        setStartMonth={setStartMonth}
        endMonth={endMonth}
        setEndMonth={setEndMonth}
        startYear={startYear}
        setStartYear={setStartYear}
        endYear={endYear}
        setEndYear={setEndYear}
      />

      <Grid container spacing={4} style={{ minHeight: "100vh" }}>
        <FilterCard
          theme={theme}
          selectedTab={selectedTab}
          handleTabChange={handleTabChange}
          handleDialog={handleDialog}
          handleMonthChange={handleMonthChange}
          filterMonth={filterMonth}
          setFilterMonth={setFilterMonth}
          setFilterYear={setFilterYear}
          filterYear={filterYear}
          openTransferDialog={openTransferDialog}
          handleTransferDialogOpen={handleTransferDialogOpen}
          handleTransferDialogClose={handleTransferDialogClose}
          handleTransferSubmit={handleTransferSubmit}
          transactions={transactions}
          handleDeleteSettings={handleDeleteSettings}
          handleEditButtonClick={handleEditButtonClick}
        />
        <NavigateCard
          theme={theme}
          colorMode={colorMode}
          totalBudget={totalBudget}
        />
      </Grid>
      {editSettings && (
        <EditSettingsDialog
          transaction={editSettings}
          onClose={() => setEditSettings(null)}
          onSave={handleEditSettings}
        />
      )}
    </div>
  );
}

export default FixedForm;
