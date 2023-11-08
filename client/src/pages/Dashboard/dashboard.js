import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../core/auth/auth";
import {
  FormControl,
  Typography,
  Box,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

const CustomSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase": {
    color: "grey",
    "&.Mui-checked": {
      color: "#be9e44",
    },
    "&.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#be9e44",
    },
  },
  "& .MuiSwitch-track": {
    backgroundColor: "grey",
  },
}));

function DashboardPage() {
  const { user } = useAuth();
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState([]);
  const [isAnnualView, setIsAnnualView] = useState(false);

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
    new Array(10),
    (_, index) => new Date().getFullYear() - index
  );
  const calculateCategoryTotals = () => {
    const categoryTotals = {};

    transactions.forEach((transaction) => {
      if (!categoryTotals[transaction.category_id]) {
        categoryTotals[transaction.category_id] = 0;
      }
      categoryTotals[transaction.category_id] += parseFloat(transaction.amount);
    });

    const totalBudget = settings.reduce((acc, setting) => {
      if (setting.transaction_type === "Einnahme") {
        return acc + parseFloat(setting.amount);
      } else if (setting.transaction_type === "Ausgabe") {
        return acc - parseFloat(setting.amount);
      }
      return acc;
    }, 0);

    const usedBudget = Object.values(categoryTotals).reduce(
      (acc, num) => acc + num,
      0
    );
    categoryTotals["remaining"] = totalBudget - usedBudget;
    return categoryTotals;
  };

  const getCategoryTotal = (categoryId) => {
    const totals = calculateCategoryTotals();
    return totals[categoryId] || 0;
  };

  const getAnnualCategoryTotal = (categoryId) => {
    const totals = calculateCategoryTotals();
    return totals[categoryId] || 0;
  };
  const calculateAnnualTotals = () => {
    const categoryTotals = {};

    transactions.forEach((transaction) => {
      if (!categoryTotals[transaction.category_id]) {
        categoryTotals[transaction.category_id] = 0;
      }
      categoryTotals[transaction.category_id] += parseFloat(transaction.amount);
    });

    const totalBudget = settings.reduce((acc, setting) => {
      if (setting.transaction_type === "Einnahme") {
        return acc + parseFloat(setting.amount);
      } else if (setting.transaction_type === "Ausgabe") {
        return acc - parseFloat(setting.amount);
      }
      return acc;
    }, 0);

    const usedBudget = Object.values(categoryTotals).reduce(
      (acc, num) => acc + num,
      0
    );
    categoryTotals["remaining"] = totalBudget - usedBudget;
    return categoryTotals;
  };

  const fetchTransactions = async () => {
    const endpointTransactions = isAnnualView
      ? "http://localhost:3001/api/getUserTransactionsAnnual"
      : "http://localhost:3001/api/getUserTransactions";
    const endpointSettings = isAnnualView
      ? "http://localhost:3001/api/getSettingsAnnual"
      : "http://localhost:3001/api/getSettings";
    const params = { year: filterYear, user_id: user.id };
    if (!isAnnualView) {
      params.month = filterMonth;
    }

    try {
      const [transactionsResponse, settingsResponse] = await Promise.all([
        axios.get(endpointTransactions, { params }),
        axios.get(endpointSettings, { params }),
      ]);

      setTransactions(transactionsResponse.data);
      setSettings(settingsResponse.data);
    } catch (error) {
      console.error("Error fetching transactions and settings:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/getCategories",
          {
            params: { user_id: user.id },
          }
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Kategorien:", error);
      }
    };

    fetchCategories();
  }, [filterMonth, filterYear, isAnnualView]);

  const chartData = {
    labels: [
      ...categories.map((category) => category.name),
      "Verbleibendes Budget",
    ],
    datasets: [
      {
        label: "Budgetverteilung",
        data: isAnnualView
          ? [
              ...categories.map(
                (category) => getAnnualCategoryTotal(category.id) || 0
              ),
              calculateAnnualTotals()["remaining"],
            ]
          : [
              ...categories.map((category) => getCategoryTotal(category.id)),
              calculateCategoryTotals()["remaining"],
            ],
        backgroundColor: [
          ...categories.map((category) => category.color || "#ffce56"),
          "#76ff03",
        ],
        hoverBackgroundColor: [
          ...categories.map((category) => category.color || "#ffce56"),
          "#76ff03",
        ],
      },
    ],
  };
  const chartOptions = {
    plugins: {
      legend: {
        position: "top",
        align: "start",
        labels: {
          color: "#e0e3e9",
          font: {
            size: 12,
            family: "Arial",
          },
          boxWidth: 30,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: "Ausgaben nach Kategorien",
        color: "#e0e3e9",
        font: {
          size: 20,
          family: "Arial",
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            let label = chartData.labels[tooltipItem.dataIndex] || "";
            if (label) {
              label += ": ";
            }
            label += new Intl.NumberFormat("de-DE", {
              style: "currency",
              currency: "EUR",
            }).format(tooltipItem.parsed);
            return label;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };
  const hasBudgetData = (totals) => {
    return Object.values(totals).reduce((acc, value) => acc + value, 0) !== 0;
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: 20 }}
      >
        <Grid item xs={12} md={8} lg={6}>
          <Card sx={{ backgroundColor: "#2e2e38" }}>
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  marginTop: 3,
                  marginBottom: 3,
                  color: "#e0e3e9",
                }}
              >
                Filter
              </Typography>
              <FormControlLabel
                control={
                  <CustomSwitch
                    checked={isAnnualView}
                    onChange={(e) => setIsAnnualView(e.target.checked)}
                  />
                }
                sx={{ marginBottom: 4, color: "#e0e3e9" }}
                label="Jahresrückblick"
              />
              <Grid container spacing={2} style={{ marginBottom: 50 }}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel style={{ color: "#e0e3e9" }}>Monat</InputLabel>
                    <Select
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value)}
                      label="Monat"
                      sx={{
                        color: "#e0e3e9",
                        "& .MuiSvgIcon-root": { color: "#e0e3e9" },
                      }}
                    >
                      {months.map((month) => (
                        <MenuItem key={month.value} value={month.value}>
                          {month.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel style={{ color: "#e0e3e9" }}>Jahr</InputLabel>
                    <Select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      label="Jahr"
                      sx={{
                        color: "#e0e3e9",
                        "& .MuiSvgIcon-root": { color: "#e0e3e9" },
                      }}
                    >
                      {years.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {hasBudgetData(
                isAnnualView
                  ? calculateAnnualTotals()
                  : calculateCategoryTotals()
              ) ? (
                <Box
                  sx={{
                    height: "500px",
                    position: "relative",
                  }}
                >
                  <Doughnut data={chartData} options={chartOptions} />
                </Box>
              ) : (
                <Box
                  sx={{
                    height: "100px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#e0e3e9", mb: 2, textAlign: "center" }}
                  >
                    Für den ausgewählten Zeitraum sind keine Budgetdaten
                    vorhanden.
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      color="button"
                      href="/settings"
                      sx={{ mr: 5, color: "#e0e3e9" }}
                    >
                      Fixkosten verwalten
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="button"
                      href="/settings"
                      sx={{ color: "#e0e3e9" }}
                    >
                      Ein und Ausgaben verwalten
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
            {hasBudgetData(
              isAnnualView ? calculateAnnualTotals() : calculateCategoryTotals()
            ) ? (
              <Grid item xs={12}>
                {isAnnualView ? (
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#e0e3e9", mt: 2 }}
                  >
                    <strong>Gesamtes Jahresbudget: </strong>
                    {calculateAnnualTotals()["remaining"].toFixed(2)} €
                  </Typography>
                ) : (
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#e0e3e9", mt: 2 }}
                  >
                    <strong>Verbleibendes Budget: </strong>
                    {calculateCategoryTotals()["remaining"].toFixed(2)} €
                  </Typography>
                )}
              </Grid>
            ) : null}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardPage;
