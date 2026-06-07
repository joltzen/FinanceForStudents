/* Copyright (c) 2026, Jason Oltzen */

import { Alert, AlertColor, Grid, Snackbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useContext, useEffect, useRef, useState } from "react";
import { months, years } from "../../config/constants";
import { useAuth } from "../../core/auth/auth";
import {
  addSettings,
  deleteSettings,
  getSettings,
  updateSettings,
} from "../../services/db";
import { ColorModeContext } from "../../theme";
import NavigateCard from "./cards";
import EditSettingsDialog from "./edit";
import FilterCard from "./fixed_manager";
import FixedDialog from "./Dialog/fixeddialog";

function FixedForm() {
  const { user } = useAuth();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const descriptionInputRef = useRef(null);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("Einnahme");

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [filterMonth, setFilterMonth] = useState(currentMonth);
  const [filterYear, setFilterYear] = useState(currentYear);
  const [transactions, setTransactions] = useState([]);
  const [editSettings, setEditSettings] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("success");

  const [startMonth, setStartMonth] = useState(currentMonth - 1);
  const [endMonth, setEndMonth] = useState(currentMonth);
  const [startYear, setStartYear] = useState(currentYear);
  const [endYear, setEndYear] = useState(currentYear);
  const [mode, setMode] = useState("range");
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (openDialog) descriptionInputRef.current?.focus();
  }, [openDialog]);

  useEffect(() => {
    fetchSettings();
  }, [filterMonth, filterYear, user.id]);

  const fetchSettings = async () => {
    try {
      setTransactions(await getSettings(user.id, filterMonth, filterYear));
    } catch (error) {
      console.error("Fetching settings failed:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (mode === "range") {
        for (let year = startYear; year <= endYear; year++) {
          const startM = year === startYear ? startMonth : 1;
          const endM = year === endYear ? endMonth : 12;
          for (let month = startM; month <= endM; month++) {
            await addSettings(user.id, {
              transaction_type: transactionType,
              amount,
              description,
              month,
              year,
            });
          }
        }
      } else {
        await addSettings(user.id, {
          transaction_type: transactionType,
          amount,
          description,
          month: filterMonth,
          year: filterYear,
        });
      }
      setSnackbarMessage("Fixkosten wurden erfolgreich hinzugefügt!");
      setSnackbarSeverity("success");
      fetchSettings();
      setAmount("");
      setDescription("");
    } catch (error) {
      console.error("Error posting settings:", error);
      setSnackbarMessage("Fehler beim Hinzufügen der Fixkosten!");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const handleDeleteSettings = async (settingsId) => {
    try {
      await deleteSettings(user.id, settingsId);
      setTransactions((prev) =>
        prev.filter((t) => t.settings_id !== settingsId),
      );
      setSnackbarMessage("Fixkosten wurden erfolgreich gelöscht!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      setSnackbarMessage("Fehler beim Löschen der Fixkosten!");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const handleEditSettings = async (transaction) => {
    try {
      await updateSettings(user.id, transaction.settings_id, {
        transaction_type: transaction.transaction_type,
        amount: transaction.amount,
        description: transaction.description,
        month: transaction.month,
        year: transaction.year,
      });
      fetchSettings();
      setSnackbarMessage("Fixkosten erfolgreich gespeichert!");
    } catch (error) {
      console.error("Error updating settings:", error);
      setSnackbarMessage("Fehler beim Speichern der Fixkosten!");
    }
    setSnackbarOpen(true);
  };

  const handleTransferSubmit = async (
    sourceMonth,
    sourceYear,
    targetMonth,
    targetYear,
  ) => {
    try {
      const [sourceData, targetData] = await Promise.all([
        getSettings(user.id, sourceMonth, sourceYear),
        getSettings(user.id, targetMonth, targetYear),
      ]);
      const toTransfer = sourceData.filter(
        (s) =>
          !targetData.some(
            (t) =>
              t.description === s.description &&
              t.amount === s.amount &&
              t.transaction_type === s.transaction_type,
          ),
      );
      for (const t of toTransfer) {
        await addSettings(user.id, {
          ...t,
          month: targetMonth,
          year: targetYear,
        });
      }
      setOpenTransferDialog(false);
      fetchSettings();
    } catch (error) {
      console.error("Transfer failed:", error);
    }
  };

  const totalBudget = transactions?.reduce(
    (total, t) =>
      t?.transaction_type === "Einnahme"
        ? total + parseFloat(t?.amount)
        : total - parseFloat(t?.amount),
    0,
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
        handleDialog={() => setOpenDialog(!openDialog)}
        handleSubmit={handleSubmit}
        theme={theme}
        months={months}
        years={years}
        filterMonth={filterMonth}
        setFilterMonth={setFilterMonth}
        filterYear={filterYear}
        setFilterYear={setFilterYear}
        description={description}
        handleDescriptionChange={(e) => setDescription(e.target.value)}
        amount={amount}
        handleAmountChange={(e) => setAmount(e.target.value)}
        transactionType={transactionType}
        handleTransactionTypeChange={(e) => setTransactionType(e.target.value)}
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
          handleTabChange={(e, v) => setSelectedTab(v)}
          handleDialog={() => setOpenDialog(!openDialog)}
          handleMonthChange={handleMonthChange}
          filterMonth={filterMonth}
          setFilterMonth={setFilterMonth}
          setFilterYear={setFilterYear}
          filterYear={filterYear}
          openTransferDialog={openTransferDialog}
          handleTransferDialogOpen={() => setOpenTransferDialog(true)}
          handleTransferDialogClose={() => setOpenTransferDialog(false)}
          handleTransferSubmit={handleTransferSubmit}
          transactions={transactions}
          handleDeleteSettings={handleDeleteSettings}
          handleEditButtonClick={(id) => {
            const t = transactions.find((t) => t.settings_id === id);
            if (t) setEditSettings(t);
          }}
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
