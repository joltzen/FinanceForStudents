import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React from "react";

const BudgetFilter = ({
  filterMonth,
  setFilterMonth,
  filterYear,
  setFilterYear,
  months,
  years,
  isAnnualView,
}) => {

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
    <Grid container spacing={2} alignItems="center">
      {!isAnnualView && (
        <Grid item>
          <IconButton onClick={() => handleMonthChange("prev")}>
            <ChevronLeftIcon />
          </IconButton>
        </Grid>
      )}

      {!isAnnualView && (
        <Grid item>
          <InputLabel>Monat</InputLabel>
          <FormControl fullWidth>
            <Select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
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

      <Grid item>
        <InputLabel>Jahr</InputLabel>
        <FormControl fullWidth>
          <Select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {!isAnnualView && (
        <Grid item>
          <IconButton onClick={() => handleMonthChange("next")}>
            <ChevronRightIcon />
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
};

export default BudgetFilter;
