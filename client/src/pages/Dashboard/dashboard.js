/* Copyright (c) 2026, Jason Oltzen */

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TuneIcon from "@mui/icons-material/Tune";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Fab,
  Grid,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "chart.js/auto";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import SwitchComp from "../../components/SwitchComp";
import { months, years } from "../../config/constants";
import { useAuth } from "../../core/auth/auth";
import { useCalculations } from "../../hooks/useCalculations";
import { useFetchData } from "../../hooks/useFetchData";
import BudgetChart from "./chart";
import BudgetFilter from "./filter";
import MonthlyExpenses from "./monthly";
import NoDataAlert from "./noalert";
import BudgetSummary from "./summary";
import MonthlySaving from "./task";
import TotalSavings from "./total";
import YearlySaving from "./yeartask";

function DashboardPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user } = useAuth();
  const navigate = useNavigate();

  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [isAnnualView, setIsAnnualView] = useState(false);
  const [chartView, setChartView] = useState("woche");
  const [totalSavingGoals, setTotalSavingGoals] = useState(0);

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
    calculateMonthlySavingsDifference,
    calcMonthlyExpense,
    calculateTotalSavings,
    cyr,
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

  const remainingBudget = isAnnualView
    ? calculateAnnualTotals()["remaining"]
    : calculateCategoryTotals()["remaining"];

  const monthlyExpenses = calcMonthlyExpense();
  const budgetTotal = monthlyExpenses + Math.max(remainingBudget, 0);
  const savingsRate = budgetTotal > 0 ? (totalSavings / budgetTotal) * 100 : 0;

  const barChartData = {
    labels: months.map((m) => m.label),
    datasets: [
      {
        data: cyr(),
        backgroundColor: [
          "rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)",
          "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)",
          "rgb(251, 44, 249)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    scales: {
      y: { beginAtZero: true, ticks: { color: theme.palette.text.primary } },
      x: { ticks: { color: theme.palette.text.primary } },
    },
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  const chartData = {
    labels: categories.map((c) => c.name),
    datasets: [
      {
        label: "Budgetverteilung",
        data: isAnnualView
          ? categories.map((c) => getAnnualCategoryTotal(c.id) || 0)
          : categories.map((c) => getCategoryTotal(c.id)),
        backgroundColor: categories.map((c) => c.color || theme.palette.budget.main),
        hoverBackgroundColor: categories.map((c) => c.color || theme.palette.budget.main),
      },
    ],
  };

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
        position: "left",
        labels: {
          color: theme.palette.text.primary,
          font: { size: 13, family: "Inter" },
          boxWidth: 28,
          padding: 20,
        },
      },
      tooltip: {
        padding: 12,
        callbacks: {
          label: (item) => {
            let label = chartData.labels[item.dataIndex] || "";
            if (label) label += ": ";
            label += new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(item.parsed);
            return label;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  const hasBudgetData = () =>
    transactions.length > 0 || settings.length > 0 || savingsGoals.length > 0;

  const cardBase = {
    backgroundColor: theme.palette.card.main,
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    borderRadius: 3,
    height: "100%",
  };

  const kpiCardSx = () => ({
    ...cardBase,
    cursor: "pointer",
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
    "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 28px rgba(0,0,0,0.22)" },
  });

  const actionRowSx = (filled) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 2,
    p: 1.75,
    mb: 1.5,
    cursor: "pointer",
    transition: "all 0.15s",
    ...(filled
      ? {
          backgroundColor: "#00bcd4",
          "&:hover": { backgroundColor: "#00acc1" },
        }
      : {
          backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
          "&:hover": { backgroundColor: isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)" },
        }),
  });

  return (
    <Box sx={{ p: 3, minHeight: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Willkommen zurück, {user?.firstname ?? ""}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.5, mt: 0.5 }}>
            Hier ist dein finanzieller Überblick für{" "}
            {isAnnualView ? "dieses Jahr" : "diesen Monat"}.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            Jahresrückblick
          </Typography>
          <SwitchComp
            checked={isAnnualView}
            onChange={(e) => setIsAnnualView(e.target.checked)}
          />
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={kpiCardSx()}
            onClick={() => navigate("/fixed")}
          >
            <CardContent sx={{ p: 2.5 }}>
              <BudgetSummary
                isAnnualView={isAnnualView}
                totalRemaining={remainingBudget}
                percentageChange={calculateMonthlySavingsDifference()}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={kpiCardSx()}
            onClick={() => navigate("/finance")}
          >
            <CardContent sx={{ p: 2.5 }}>
              <MonthlyExpenses
                expenses={monthlyExpenses}
                budgetTotal={budgetTotal}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={kpiCardSx()}
            onClick={() => navigate("/saving")}
          >
            <CardContent sx={{ p: 2.5 }}>
              {isAnnualView ? (
                <YearlySaving savings={totalSavings} />
              ) : (
                <MonthlySaving
                  savings={totalSavings}
                  month={filterMonth}
                  savingsRate={savingsRate}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={kpiCardSx()}>
            <CardContent sx={{ p: 2.5 }}>
              <TotalSavings
                total={calculateTotalSavings()}
                savingsGoalCount={savingsGoals.length}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom row */}
      <Grid container spacing={2}>
        {/* Ausgabentrends */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ ...cardBase, "&:hover": undefined }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Ausgabentrends
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.45 }}>
                    Wöchentliche Analyse deiner Finanzen
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  {[
                    { key: "woche", label: "Woche" },
                    { key: "monat", label: "Monat" },
                  ].map(({ key, label }) => (
                    <Box
                      key={key}
                      onClick={() => setChartView(key)}
                      sx={{
                        px: 1.75,
                        py: 0.6,
                        borderRadius: 2,
                        cursor: "pointer",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        backgroundColor:
                          chartView === key
                            ? "rgba(198,170,96,0.18)"
                            : isDark
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.05)",
                        color:
                          chartView === key
                            ? "#c6aa60"
                            : isDark
                              ? "rgba(224,227,233,0.4)"
                              : "rgba(0,0,0,0.35)",
                        transition: "all 0.15s",
                        "&:hover": { backgroundColor: "rgba(198,170,96,0.12)" },
                      }}
                    >
                      {label}
                    </Box>
                  ))}
                </Box>
              </Box>

              {!isAnnualView && chartView === "woche" && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                    opacity: 0.75,
                  }}
                >
                  <TuneIcon sx={{ fontSize: 16, opacity: 0.5 }} />
                  <BudgetFilter
                    filterMonth={filterMonth}
                    setFilterMonth={setFilterMonth}
                    filterYear={filterYear}
                    setFilterYear={setFilterYear}
                    months={months}
                    years={years}
                    isAnnualView={isAnnualView}
                  />
                </Box>
              )}

              {hasBudgetData() ? (
                <Box sx={{ height: 300, mt: 1 }}>
                  {chartView === "woche" ? (
                    <BudgetChart
                      chartData={chartData}
                      chartOptions={chartOptions}
                    />
                  ) : (
                    <Bar data={barChartData} options={barChartOptions} />
                  )}
                </Box>
              ) : (
                <NoDataAlert />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Aktionen */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ ...cardBase, "&:hover": undefined }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Aktionen
              </Typography>

              <Box onClick={() => navigate("/finance")} sx={actionRowSx(true)}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <AddCircleOutlineIcon sx={{ color: "#fff", fontSize: 20 }} />
                  <Typography
                    sx={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}
                  >
                    Transaktionen hinzufügen
                  </Typography>
                </Box>
                <ChevronRightIcon
                  sx={{ color: "rgba(255,255,255,0.7)", fontSize: 20 }}
                />
              </Box>

              <Box onClick={() => navigate("/fixed")} sx={actionRowSx(false)}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <TuneIcon
                    sx={{
                      color: isDark
                        ? "rgba(224,227,233,0.7)"
                        : "rgba(44,47,54,0.7)",
                      fontSize: 20,
                    }}
                  />
                  <Typography
                    sx={{
                      color: isDark
                        ? "rgba(224,227,233,0.7)"
                        : "rgba(44,47,54,0.7)",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    Fixkosten verwalten
                  </Typography>
                </Box>
                <ChevronRightIcon
                  sx={{
                    color: isDark
                      ? "rgba(224,227,233,0.3)"
                      : "rgba(44,47,54,0.3)",
                    fontSize: 20,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* FAB */}
      <Fab
        size="medium"
        onClick={() => navigate("/finance")}
        sx={{
          position: "fixed",
          bottom: 28,
          right: 28,
          backgroundColor: "#00bcd4",
          color: "#fff",
          "&:hover": { backgroundColor: "#00acc1" },
          boxShadow: "0 4px 20px rgba(0,188,212,0.45)",
          zIndex: 1300,
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}

export default DashboardPage;
