import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
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
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [totalSavingGoals, setTotalSavingGoals] = useState(0);

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

  function calculateSavingGoalsTotal() {
    let totalSavings = 0;

    savingsGoals.forEach((goal) => {
      const startMonth = new Date(goal.startdate).getMonth() + 1;
      const startYear = new Date(goal.startdate).getFullYear();
      const endMonth = new Date(goal.deadline).getMonth() + 1;
      const endYear = new Date(goal.deadline).getFullYear();

      if (
        (filterYear > startYear ||
          (filterYear === startYear && filterMonth >= startMonth)) &&
        (filterYear < endYear ||
          (filterYear === endYear && filterMonth <= endMonth))
      ) {
        totalSavings += parseFloat(goal.monthly_saving);
      }
    });

    return totalSavings;
  }

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
    categoryTotals["remaining"] = totalBudget - usedBudget - totalSavingGoals;
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
      ? "/getUserTransactionsAnnual"
      : "/getUserTransactions";
    const endpointSettings = isAnnualView
      ? "/getSettingsAnnual"
      : "/getSettings";
    const params = { year: filterYear, user_id: user.id };
    if (!isAnnualView) {
      params.month = filterMonth;
    }

    try {
      const [transactionsResponse, settingsResponse] = await Promise.all([
        axiosInstance.get(endpointTransactions, { params }),
        axiosInstance.get(endpointSettings, { params }),
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
        const response = await axiosInstance.get("/getCategories", {
          params: { user_id: user.id },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Kategorien:", error);
      }
    };

    fetchCategories();
    fetchCategories();
    const fetchGoals = async () => {
      try {
        const response = await axiosInstance.get("/get-saving-goals", {
          params: { userId: user.id },
        });
        setSavingsGoals(response.data);
      } catch (error) {
        console.error("Fehler beim Abrufen der Sparziele", error);
      }
    };

    fetchGoals();
  }, [filterMonth, filterYear, isAnnualView]);

  useEffect(() => {
    const totalSavings = calculateSavingGoalsTotal();
    setTotalSavingGoals(totalSavings);
  }, [savingsGoals, filterMonth, filterYear]);

  const chartData = {
    labels: categories.map((category) => category.name),
    datasets: [
      {
        label: "Budgetverteilung",
        data: isAnnualView
          ? categories.map(
              (category) => getAnnualCategoryTotal(category.id) || 0
            )
          : categories.map((category) => getCategoryTotal(category.id)),
        backgroundColor: categories.map(
          (category) => category.color || "#ffce56"
        ),
        hoverBackgroundColor: categories.map(
          (category) => category.color || "#ffce56"
        ),
      },
    ],
  };

  const remainingBudget = isAnnualView
    ? calculateAnnualTotals()["remaining"]
    : calculateCategoryTotals()["remaining"];

  if (remainingBudget > 0) {
    chartData.labels.push("Verbleibendes Budget");
    chartData.datasets[0].data.push(remainingBudget);
    chartData.datasets[0].backgroundColor.push("#76ff03");
    chartData.datasets[0].hoverBackgroundColor.push("#76ff03");
  }

  if (totalSavingGoals > 0) {
    chartData.labels.push("Sparen");
    chartData.datasets[0].data.push(totalSavingGoals);
    chartData.datasets[0].backgroundColor.push("#4E8F94");
    chartData.datasets[0].hoverBackgroundColor.push("#4E8F94");
  }

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
  const hasBudgetData = () => {
    return (
      transactions.length > 0 || settings.length > 0 || savingsGoals.length > 0
    );
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: 20 }}
      >
        <Grid item xs={12} md={8} lg={6}>
          <Card sx={{ backgroundColor: "#262b3d" }}>
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
                Dashboard
              </Typography>
              <Grid
                container
                spacing={2}
                style={{ marginBottom: 20 }}
                alignItems="center"
              >
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <CustomSwitch
                        checked={isAnnualView}
                        onChange={(e) => setIsAnnualView(e.target.checked)}
                      />
                    }
                    sx={{ color: "#e0e3e9" }}
                    label="Jahresrückblick"
                  />
                </Grid>
                {!isAnnualView && (
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth margin="none">
                      <InputLabel style={{ color: "#e0e3e9" }}>
                        Monat
                      </InputLabel>
                      <Select
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        label="Monat"
                        sx={{
                          color: "#e0e3e9",
                          backgroundColor: "#333540",
                          border: "1px solid #e0e3e9",
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
                )}
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth margin="none">
                    <InputLabel style={{ color: "#e0e3e9" }}>Jahr</InputLabel>
                    <Select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      label="Jahr"
                      sx={{
                        color: "#e0e3e9",
                        backgroundColor: "#333540",
                        border: "1px solid #e0e3e9",
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

              {hasBudgetData() && (
                <Box
                  sx={{
                    height: "500px",
                    position: "relative",
                  }}
                >
                  <Doughnut data={chartData} options={chartOptions} />
                </Box>
              )}
              {!hasBudgetData() && (
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
