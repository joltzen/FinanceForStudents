import React, { useEffect, useState } from "react";
import { useAuth } from "../../core/auth/auth";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  FormControlLabel,
} from "@mui/material";
import "chart.js/auto";
import SwitchComp from "../../components/SwitchComp";
import BudgetFilter from "./budgetfilter";
import BudgetChart from "./budgetchart";
import NoDataAlert from "./noalert";
import { useFetchData } from "../../hooks/useFetchData";
import { useCalculations } from "../../hooks/useCalculations";

function DashboardPage() {
  const { user } = useAuth();
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [isAnnualView, setIsAnnualView] = useState(false);
  const [totalSavingGoals, setTotalSavingGoals] = useState(0);
  const { transactions, categories, settings, savingsGoals } = useFetchData(
    user,
    isAnnualView,
    filterMonth,
    filterYear
  );
  const {
    calculateSavingGoalsTotal,
    calculateAnnualSavingGoalsTotal,
    calculateCategoryTotals,
  } = useCalculations(
    transactions,
    settings,
    savingsGoals,
    filterMonth,
    filterYear,
    totalSavingGoals
  );

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
    categoryTotals["remaining"] = totalBudget - usedBudget - totalSavingGoals;
    return categoryTotals;
  };

  useEffect(() => {
    var totalSavings = 0;
    if (isAnnualView) {
      totalSavings = calculateAnnualSavingGoalsTotal();
    } else {
      totalSavings = calculateSavingGoalsTotal();
    }
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
    chartData.datasets[0].backgroundColor.push("#4dd0e1");
    chartData.datasets[0].hoverBackgroundColor.push("#4dd0e1");
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
                      <SwitchComp
                        checked={isAnnualView}
                        onChange={(e) => setIsAnnualView(e.target.checked)}
                      />
                    }
                    sx={{ color: "#e0e3e9" }}
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
                <BudgetChart
                  chartData={chartData}
                  chartOptions={chartOptions}
                />
              ) : (
                <NoDataAlert />
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
