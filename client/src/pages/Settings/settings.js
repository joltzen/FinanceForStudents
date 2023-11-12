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

function SettingsForm() {
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("Einnahme");
  const [transactions, setTransactions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const { user } = useAuth();

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDialog = () => {
    setOpenDialog(!openDialog);
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
  }, [filterMonth, filterYear, user.id]);

  return (
    <Page>
      <Grid item xs={12} md={8} lg={6}>
        <AddButton
          variant="contained"
          startIcon={<AddCircleOutline />}
          onClick={handleDialog}
        >
          Transaktion hinzufügen
        </AddButton>
        <Dialog open={openDialog} onClose={handleDialog}>
          <DialogTitle sx={{ backgroundColor: "#262b3d", color: "#e0e3e9" }}>
            Neue Transaktion
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: "#262b3d" }}>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth>
                <InputLabel style={{ color: "#e0e3e9" }}>
                  Fixkostentyp
                </InputLabel>
                <SelectComp
                  value={transactionType}
                  onChange={handleTransactionTypeChange}
                  label="Transaktionstyp"
                >
                  <MenuItem value="Einnahme">Einnahme</MenuItem>
                  <MenuItem value="Ausgabe">Ausgabe</MenuItem>
                </SelectComp>
              </FormControl>
              <TextComp
                label="Beschreibung"
                type="text"
                value={description}
                onChange={handleDescriptionChange}
                fullWidth
                required
              />
              <br />
              <TextComp
                label="Betrag"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                fullWidth
                required
              />
              <FormControl sx={{ marginTop: 3 }}>
                <InputLabel style={{ color: "#e0e3e9" }}>Monat</InputLabel>
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
                <InputLabel style={{ color: "#e0e3e9" }}>Jahr</InputLabel>
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
          <DialogActions sx={{ backgroundColor: "#262b3d" }}>
            <Button
              onClick={handleDialog}
              color="primary"
              sx={{ color: "#e0e3e9" }}
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleSubmit}
              color="primary"
              sx={{ color: "#e0e3e9" }}
            >
              Speichern
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <Typography variant="h4" sx={{ mb: 4, mt: 5, color: "#e0e3e9" }}>
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
            backgroundColor: "#333740",
            color: "#e0e3e9",
            ".MuiTabs-indicator": {
              backgroundColor: "#c6aa60",
            },
            borderRadius: "50px",
            marginBottom: 2,
            ".MuiTab-root": {
              color: "#e0e3e9",
              fontWeight: "bold",
              marginRight: 2,
              "&.Mui-selected": {
                color: "#c6aa60",
                borderBottom: "2px solid #c6aa60",
              },
            },
          }}
        >
          <Tab label="Einnahmen" />
          <Tab label="Ausgaben" />
        </Tabs>
        <FormControl sx={{ marginTop: 3 }}>
          <InputLabel style={{ color: "#e0e3e9" }}>Monat</InputLabel>
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
        <FormControl sx={{ marginLeft: 3, marginTop: 3, marginBottom: 3 }}>
          <InputLabel style={{ color: "#e0e3e9" }}>Jahr</InputLabel>
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
        {selectedTab === 0 && (
          <TransactionSection
            transactions={transactions}
            filterMonth={filterMonth}
            filterYear={filterYear}
            handleDeleteSettings={handleDeleteSettings}
            transactionType="Einnahme"
          />
        )}
        {selectedTab === 1 && (
          <TransactionSection
            transactions={transactions}
            filterMonth={filterMonth}
            filterYear={filterYear}
            handleDeleteSettings={handleDeleteSettings}
            transactionType="Ausgabe"
          />
        )}
      </Box>
    </Page>
  );
}

export default SettingsForm;
