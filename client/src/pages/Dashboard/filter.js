// BudgetFilter.js
import React from "react";
import { FormControl, InputLabel, MenuItem, Grid } from "@mui/material";
import SelectComp from "../../components/SelectComp";
import { useTheme } from "@mui/material/styles";

const BudgetFilter = ({
  filterMonth,
  setFilterMonth,
  filterYear,
  setFilterYear,
  months,
  years,
  isAnnualView,
}) => {
  const theme = useTheme();

  return (
    <>
      {!isAnnualView && (
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth margin="none">
            <InputLabel style={{ color: theme.palette.text.main }}>
              Monat
            </InputLabel>
            <SelectComp
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              label="Monat"
            >
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </SelectComp>
          </FormControl>
        </Grid>
      )}
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth margin="none">
          <InputLabel style={{ color: theme.palette.text.main }}>
            Jahr
          </InputLabel>
          <SelectComp
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            label="Jahr"
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </SelectComp>
        </FormControl>
      </Grid>
    </>
  );
};

export default BudgetFilter;
