import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, FormControl, IconButton, MenuItem, Select } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

const BudgetFilter = ({ filterMonth, setFilterMonth, filterYear, setFilterYear, months, years, isAnnualView }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleMonthChange = (direction) => {
    let m = filterMonth + (direction === "next" ? 1 : -1);
    let y = filterYear;
    if (m > 12) { m = 1; y++; }
    else if (m < 1) { m = 12; y--; }
    setFilterMonth(m);
    setFilterYear(y);
  };

  const selectSx = {
    height: 34,
    fontSize: "0.82rem",
    borderRadius: 2,
    color: theme.palette.text.main,
    backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(78,87,123,0.06)",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(198,170,96,0.4)" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#c6aa60" },
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      {!isAnnualView && (
        <IconButton size="small" onClick={() => handleMonthChange("prev")}
          sx={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)", "&:hover": { color: "#c6aa60" } }}>
          <ChevronLeftIcon sx={{ fontSize: 18 }} />
        </IconButton>
      )}
      {!isAnnualView && (
        <FormControl size="small" sx={{ minWidth: 110 }}>
          <Select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} sx={selectSx}>
            {months.map((m) => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
          </Select>
        </FormControl>
      )}
      <FormControl size="small" sx={{ minWidth: 76 }}>
        <Select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} sx={selectSx}>
          {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
        </Select>
      </FormControl>
      {!isAnnualView && (
        <IconButton size="small" onClick={() => handleMonthChange("next")}
          sx={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)", "&:hover": { color: "#c6aa60" } }}>
          <ChevronRightIcon sx={{ fontSize: 18 }} />
        </IconButton>
      )}
    </Box>
  );
};

export default BudgetFilter;
