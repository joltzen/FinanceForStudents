// BudgetChart.js
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Box } from "@mui/material";

const BudgetChart = ({ chartData, chartOptions }) => {
  return (
    <Box sx={{ height: "500px", position: "relative" }}>
      <Doughnut data={chartData} options={chartOptions} />
    </Box>
  );
};

export default BudgetChart;
