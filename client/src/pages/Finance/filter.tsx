/* Copyright (c) 2026, Jason Oltzen */

import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { months, years } from "../../config/constants";

function FilterTransactions({
  setFilterYear,
  setFilterMonth,
  filterYear,
  filterMonth,
  categories,
  selectedCategory,
  handleCategoryChange,
  searchQuery,
  handleSearchInputChange,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const selectSx = {
    height: 40,
    borderRadius: 2,
    fontSize: "0.875rem",
    backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(78,87,123,0.06)",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: isDark ? "rgba(198,170,96,0.5)" : "rgba(78,87,123,0.4)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#c6aa60",
    },
    color: theme.palette.text.main,
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "flex-end",
        px: 3,
        py: 2,
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 1 }}>
        <FilterListIcon
          sx={{
            fontSize: 18,
            color: isDark ? "rgba(198,170,96,0.7)" : theme.palette.primary.main,
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: isDark ? "rgba(198,170,96,0.7)" : theme.palette.primary.main,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Filter
        </Typography>
      </Box>

      <FormControl size="small" sx={{ minWidth: 130 }}>
        <Select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          sx={selectSx}
          displayEmpty
        >
          {months.map((m) => (
            <MenuItem key={m.value} value={m.value}>
              {m.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 90 }}>
        <Select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          sx={selectSx}
        >
          {years.map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          displayEmpty
          sx={{
            ...selectSx,
            ...(selectedCategory && {
              backgroundColor: `${categories.find((c) => c.id === selectedCategory)?.color}22`,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: `${categories.find((c) => c.id === selectedCategory)?.color}66`,
              },
            }),
          }}
        >
          <MenuItem value="">
            <Typography variant="body2" sx={{ opacity: 0.5 }}>
              Alle Kategorien
            </Typography>
          </MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: c.color,
                    flexShrink: 0,
                  }}
                />
                {c.name}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        size="small"
        placeholder="Suchen…"
        value={searchQuery}
        onChange={handleSearchInputChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                sx={{
                  fontSize: 17,
                  color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
                }}
              />
            </InputAdornment>
          ),
        }}
        sx={{
          minWidth: 180,
          "& .MuiOutlinedInput-root": {
            height: 40,
            borderRadius: 2,
            fontSize: "0.875rem",
            backgroundColor: isDark
              ? "rgba(255,255,255,0.05)"
              : "rgba(78,87,123,0.06)",
            "& fieldset": {
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            },
            "&:hover fieldset": {
              borderColor: isDark
                ? "rgba(198,170,96,0.5)"
                : "rgba(78,87,123,0.4)",
            },
            "&.Mui-focused fieldset": { borderColor: "#c6aa60" },
          },
          "& .MuiInputBase-input": { color: theme.palette.text.main },
        }}
      />
    </Box>
  );
}

export default FilterTransactions;
