import React, { useEffect, useState, useContext } from "react";
import { useAuth } from "../../core/auth/auth";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  FormControlLabel,
  Button,
} from "@mui/material";
import "chart.js/auto";
import SwitchComp from "../../components/SwitchComp";
import BudgetFilter from "./filter";
import BudgetChart from "./chart";
import NoDataAlert from "./noalert";
import { useFetchData } from "../../hooks/useFetchData";
import { useCalculations } from "../../hooks/useCalculations";
import BudgetSummary from "./summary";
import { months, years } from "../../config/constants";
import { Bar } from "react-chartjs-2";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "../../theme";
import MonthlyExpenses from "./monthly";
import MonthlySaving from "./task";
import TotalSavings from "./total";

function DashboardPage() {
  const theme = useTheme();

  const { user } = useAuth();
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [isAnnualView, setIsAnnualView] = useState(false);
  const [totalSavingGoals, setTotalSavingGoals] = useState(0);
  const [showBarChart, setShowBarChart] = useState(true);
  const {
    prevMonthTransactions,
    prevSettings,
    transactions,
    categories,
    settings,
    savingsGoals,
    allTransactions,
    allSettings,
    allSaving,
  } = useFetchData(user, isAnnualView, filterMonth, filterYear);

  const {
    calculateCategoryTotals,
    totalSavings,
    calculateAnnualTotals,
    getCategoryTotal,
    getAnnualCategoryTotal,
    calculateMonthlyRemainingBudgets,
    calculateMonthlySavingsDifference,
    calcMonthlyExpense,
    calculateTotalSavings,
  } = useCalculations(
    transactions,
    settings,
    savingsGoals,
    filterMonth,
    filterYear,
    totalSavingGoals,
    isAnnualView,
    prevMonthTransactions,
    prevSettings,
    allTransactions,
    allSettings,
    allSaving
  );

  useEffect(() => {
    setTotalSavingGoals(totalSavings);
  }, [totalSavings]);

  const handleChartToggle = (event) => {
    setIsAnnualView(event.target.checked);
  };

  const barChartData = {
    labels: months.map((month) => month.label),
    datasets: [
      {
        data: calculateMonthlyRemainingBudgets(), // Example data
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: theme.palette.text.primary,
        },
      },
      x: {
        ticks: {
          color: theme.palette.text.primary,
        },
      },
    },
    plugins: {
      legend: {
        display: false, // This hides the legend
      },
    },
  };

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
          (category) => category.color || theme.palette.budget.main
        ),
        hoverBackgroundColor: categories.map(
          (category) => category.color || theme.palette.budget.main
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
    chartData.datasets[0].backgroundColor.push(theme.palette.budget.main);
    chartData.datasets[0].hoverBackgroundColor.push(theme.palette.budget.main);
  }

  if (totalSavingGoals > 0) {
    chartData.labels.push("Sparen");
    chartData.datasets[0].data.push(totalSavingGoals);
    chartData.datasets[0].backgroundColor.push(theme.palette.saving.main);
    chartData.datasets[0].hoverBackgroundColor.push(theme.palette.saving.main);
  }

  const chartOptions = {
    plugins: {
      legend: {
        position: "left", // Position the legend to the left of the chart
        labels: {
          color: theme.palette.text.main, // Set the color of the text
          font: {
            size: 15,
            family: "Arial",
          },
          boxWidth: 40, // Width of the color box
          padding: 40, // Padding around labels
          margin: 20,
        },
      },
      title: {
        display: false,
        text: "Ausgaben nach Kategorien",

        color: theme.palette.text.main,
        font: {
          size: 20,
          family: "Arial",
        },
      },
      tooltip: {
        padding: 16,
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
  const colorMode = useContext(ColorModeContext); // Access the color mode context

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      {/* Top Row: Four Smaller Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card
            sx={{ backgroundColor: theme.palette.card.main, height: "100%" }}
          >
            <CardContent>
              <BudgetSummary
                isAnnualView={isAnnualView}
                totalRemaining={remainingBudget}
                percentageChange={calculateMonthlySavingsDifference()}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card
            sx={{ backgroundColor: theme.palette.card.main, height: "100%" }}
          >
            <CardContent>
              <MonthlyExpenses expenses={calcMonthlyExpense()} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card
            sx={{ backgroundColor: theme.palette.card.main, height: "100%" }}
          >
            <CardContent>
              <MonthlySaving savings={totalSavings} month={filterMonth} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card
            sx={{ backgroundColor: theme.palette.card.main, height: "100%" }}
          >
            <CardContent>
              <TotalSavings total={calculateTotalSavings()} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Row: Two Cards */}
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{ backgroundColor: theme.palette.card.main, height: "100%" }}
          >
            <CardContent>
              <Grid
                container
                spacing={2}
                style={{ marginBottom: 20 }}
                alignItems="center"
              >
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <SwitchComp
                        checked={isAnnualView}
                        onChange={handleChartToggle}
                      />
                    }
                    sx={{ color: theme.palette.text.main }}
                    label="Jahresrückblick"
                  />
                </Grid>

                <BudgetFilter
                  filterMonth={filterMonth}
                  setFilterMonth={setFilterMonth}
                  filterYear={filterYear}
                  setFilterYear={setFilterYear}
                  months={months}
                  years={years}
                  isAnnualView={isAnnualView}
                />
              </Grid>
              {hasBudgetData() ? (
                <>
                  <Box mb={5} mt={5}>
                    <BudgetChart
                      chartData={chartData}
                      chartOptions={chartOptions}
                    />
                  </Box>
                </>
              ) : (
                <NoDataAlert />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{ backgroundColor: theme.palette.card.main, height: "100%" }}
          >
            <CardContent>
              <Box sx={{ mt: 3 }}>
                <Bar data={barChartData} options={barChartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardPage;
