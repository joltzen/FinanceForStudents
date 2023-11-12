import React, { useState, useEffect } from "react";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import {
  FormControl,
  InputLabel,
  Button,
  Select,
  MenuItem,
  Box,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
} from "@mui/material";
import { styled } from "@mui/system";
import StyledTableCell from "../../components/tablecell";
import DialogPage from "../Settings/dialog";
import DeleteIcon from "@mui/icons-material/Delete";
import Page from "../../components/page";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import TextComp from "../../components/TextComp";
const AddButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.primary.main),
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  position: "fixed",
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  [theme.breakpoints.up("sm")]: {
    right: theme.spacing(10),
  },
}));

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

  const months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ].map((label, index) => ({ value: index + 1, label }));

  const years = Array.from(
    { length: 10 },
    (_, index) => new Date().getFullYear() - index
  );

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
          onClick={handleOpenDialog}
        >
          Transaktion hinzufügen
        </AddButton>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle sx={{ backgroundColor: "#262b3d", color: "#e0e3e9" }}>
            Neue Transaktion
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: "#262b3d" }}>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth>
                <InputLabel style={{ color: "#e0e3e9" }}>
                  Fixkostentyp
                </InputLabel>
                <Select
                  value={transactionType}
                  onChange={handleTransactionTypeChange}
                  label="Transaktionstyp"
                  sx={{
                    color: "#e0e3e9",
                    backgroundColor: "#2e2e38",
                    border: "1px solid #e0e3e9",
                  }}
                >
                  <MenuItem value="Einnahme">Einnahme</MenuItem>
                  <MenuItem value="Ausgabe">Ausgabe</MenuItem>
                </Select>
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
                <Select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  label="Monat"
                  sx={{
                    color: "#e0e3e9",
                    backgroundColor: "#2e2e38",
                    border: "1px solid #e0e3e9",
                  }}
                >
                  {months.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ marginLeft: 3, marginTop: 3 }}>
                <InputLabel style={{ color: "#e0e3e9" }}>Jahr</InputLabel>
                <Select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  label="Jahr"
                  sx={{
                    color: "#e0e3e9",
                    backgroundColor: "#2e2e38",
                    border: "1px solid #e0e3e9",
                  }}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: "#262b3d" }}>
            <Button
              onClick={handleCloseDialog}
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
          <Select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            label="Monat"
            sx={{
              color: "#e0e3e9",
              backgroundColor: "#2e2e38",
              border: "1px solid #e0e3e9",
            }}
          >
            {months.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ marginLeft: 3, marginTop: 3, marginBottom: 3 }}>
          <InputLabel style={{ color: "#e0e3e9" }}>Jahr</InputLabel>
          <Select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            label="Jahr"
            sx={{
              color: "#e0e3e9",
              backgroundColor: "#2e2e38",
              border: "1px solid #e0e3e9",
            }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
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

function TransactionSection({
  transactions,
  filterMonth,
  filterYear,
  handleDeleteSettings,
  transactionType,
}) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell text="Beschreibung" />
            <StyledTableCell text="Betrag" />
            <StyledTableCell text=" " />
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions
            .filter(
              (t) =>
                t?.transaction_type === transactionType &&
                t?.month === filterMonth &&
                t?.year === filterYear
            )
            .map((item) => (
              <TableRow
                key={item.settings_id}
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: "#e0e3e9",
                  },
                  "&:nth-of-type(even)": {
                    backgroundColor: "#D2D5DC",
                  },
                  borderRight: "1px solid",
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ borderRight: "1px solid" }}
                >
                  {item.description}
                </TableCell>
                <TableCell align="left" sx={{ borderRight: "1px solid" }}>
                  {item.amount} €
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleDeleteSettings(item.settings_id)}
                    style={{ color: "black" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default SettingsForm;
