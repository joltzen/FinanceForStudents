import React, { useState, useEffect } from "react";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import {
  FormControl,
  InputLabel,
  Button,
  MenuItem,
  Box,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
} from "@mui/material";
import DialogPage from "../Settings/dialog";
import Page from "../../components/page";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import TextComp from "../../components/TextComp";
import SelectComp from "../../components/SelectComp";
import TransactionSection from "./transactionselect";
import AddButton from "../../components/AddButtonComp";
import { months, years } from "../../config/constants";
import TransferDialog from "./transerdialog";
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "@mui/material/styles";

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

  return (
    <Page>
      <Grid item xs={12} md={8} lg={6}>
        <AddButton
          variant="contained"
          startIcon={<AddCircleOutline />}
          onClick={handleDialog}
        >
          Fixkosten hinzufügen
        </AddButton>
        <Dialog open={openDialog} onClose={handleDialog}>
          <DialogTitle
            sx={{
              backgroundColor: theme.palette.card.main,
              color: theme.palette.text.main,
            }}
          >
            Neue Fixkosten
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: theme.palette.card.main }}>
            <form onSubmit={handleSubmit}>
              <InputLabel
                sx={{ color: theme.palette.text.main, mt: 2, mb: 2 }}
                id="category-label"
              >
                Transaktionstyp
              </InputLabel>
              <FormControl fullWidth>
                <SelectComp
                  value={transactionType}
                  onChange={handleTransactionTypeChange}
                >
                  <MenuItem value="Einnahme">Einnahme</MenuItem>
                  <MenuItem value="Ausgabe">Ausgabe</MenuItem>
                </SelectComp>
              </FormControl>
              <InputLabel
                sx={{ color: theme.palette.text.main, mt: 2 }}
                id="category-label"
              >
                Beschreibung
              </InputLabel>
              <TextComp
                type="text"
                value={description}
                onChange={handleDescriptionChange}
                fullWidth
                required
              />
              <InputLabel
                sx={{ color: theme.palette.text.main, mt: 2 }}
                id="category-label"
              >
                Betrag
              </InputLabel>
              <TextComp
                type="number"
                value={amount}
                onChange={handleAmountChange}
                fullWidth
                required
              />

              <FormControl sx={{ marginTop: 3 }}>
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
              <FormControl sx={{ marginLeft: 3, marginTop: 3 }}>
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
            </form>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: theme.palette.card.main }}>
            <Button
              onClick={handleDialog}
              sx={{ color: theme.palette.text.main }}
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleSubmit}
              sx={{ color: theme.palette.text.main }}
            >
              Speichern
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <Typography
        variant="h4"
        sx={{ mb: 4, mt: 5, color: theme.palette.text.main }}
      >
        Fixkosten
      </Typography>

      <Box sx={{ width: "40%", marginTop: 2 }}>
        <DialogPage />
      </Box>
      <Box sx={{ width: "40%", marginTop: 10, marginBottom: 20 }}>
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
            <Button variant="contained" onClick={handleTransferDialogOpen}>
              Fixkosten übertragen
            </Button>
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

function EditSettingsDialog({ transaction, onClose, onSave }) {
  const [editedSettings, setEditedSettings] = useState({
    ...transaction,
  });
  const theme = useTheme();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedSettings({
      ...editedSettings,
      [name]: value,
    });
  };

  const handleSelectChange = (event) => {
    setEditedSettings({
      ...editedSettings,
      transaction_type: event.target.value,
    });
  };
  const handleMonthChange = (event) => {
    setEditedSettings({
      ...editedSettings,
      month: event.target.value,
    });
  };
  const handleYearChange = (event) => {
    setEditedSettings({
      ...editedSettings,
      year: event.target.value,
    });
  };

  const handleSave = () => {
    onSave(editedSettings);
    onClose();
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = "0" + month;
    }
    if (day.length < 2) {
      day = "0" + day;
    }

    return [year, month, day].join("-");
  }

  return (
    <Dialog open={!!transaction} onClose={onClose}>
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.card.main,
          color: theme.palette.text.main,
        }}
      >
        Bearbeiten
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: theme.palette.card.main }}>
        <FormControl fullWidth>
          <InputLabel style={{ color: theme.palette.text.main }}>
            Transaktionstyp
          </InputLabel>
          <SelectComp
            value={editedSettings.transaction_type}
            onChange={handleSelectChange}
            label="Transaktionstyp"
            sx={{
              color: theme.palette.text.main,
              backgroundColor: theme.palette.select.main,
              border: `1px solid ${theme.palette.text.main}`,
            }}
          >
            <MenuItem value="Ausgabe">Ausgabe</MenuItem>
            <MenuItem value="Einnahme">Einnahme</MenuItem>
          </SelectComp>
        </FormControl>
        <TextComp
          label="Beschreibung"
          type="text"
          name="description"
          value={editedSettings.description}
          onChange={handleInputChange}
          fullWidth
        />
        <TextComp
          label="Betrag"
          type="number"
          name="amount"
          value={editedSettings.amount}
          onChange={handleInputChange}
          fullWidth
        />
        <FormControl sx={{ marginRight: 3, flexGrow: 1, marginTop: 2 }}>
          <InputLabel style={{ color: theme.palette.text.main }}>
            Monat
          </InputLabel>
          <SelectComp value={editedSettings.month} onChange={handleMonthChange}>
            {months?.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </SelectComp>
        </FormControl>
        <FormControl sx={{ marginRight: 3, flexGrow: 1, marginTop: 2 }}>
          <InputLabel style={{ color: theme.palette.text.main }}>
            Jahr
          </InputLabel>
          <SelectComp
            value={editedSettings.year}
            onChange={handleYearChange}
            label="Jahr"
          >
            {years?.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </SelectComp>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: theme.palette.card.main }}>
        <Button onClick={onClose} sx={{ color: theme.palette.text.main }}>
          Abbrechen
        </Button>
        <Button onClick={handleSave} sx={{ color: theme.palette.text.main }}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SettingsForm;
