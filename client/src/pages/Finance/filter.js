/* Copyright (c) 2023, Jason Oltzen */

import SearchIcon from "@mui/icons-material/Search";
import {
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
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
  const theme = new useTheme();
  return (
    <Grid container spacing={2} sx={{ padding: 3, ml: 2, mt: 2 }}>
      <Grid item xs={12} sm={6} md={3} sx={{ mt: 3 }}>
        <InputLabel sx={{ marginBottom: 2 }}>Monat</InputLabel>
        <FormControl
          fullWidth
          sx={{
            marginBottom: 2,
            backgroundColor: theme.palette.card.main,
            height: "40px",
          }}
        >
          <Select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            sx={{
              color: theme.palette.text.main,
              height: "40px",
              ".MuiInputBase-input": {
                paddingTop: "5px",
                paddingBottom: "5px",
              },
              border: `1px solid ${theme.palette.text.main}`,
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
      <Grid item xs={12} sm={6} md={3} sx={{ mt: 3 }}>
        <InputLabel sx={{ marginBottom: 2, marginLeft: 1 }}>Jahr</InputLabel>
        <FormControl
          fullWidth
          sx={{
            marginLeft: 1,
            marginBottom: 2,
            backgroundColor: theme.palette.card.main,
            height: "40px",
          }}
        >
          <Select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            sx={{
              color: theme.palette.text.main,
              height: "40px",
              ".MuiInputBase-input": {
                paddingTop: "5px",
                paddingBottom: "5px",
              },
              border: `1px solid ${theme.palette.text.main}`,
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

      <Grid item xs={12} sm={6} md={3} sx={{ mt: 3 }}>
        <InputLabel sx={{ marginBottom: 2, marginLeft: 1 }}>
          Filter nach Kategorie
        </InputLabel>
        <FormControl
          fullWidth
          sx={{
            marginLeft: 1,
            marginBottom: 2,
            backgroundColor: selectedCategory
              ? categories.find((c) => c.id === selectedCategory)?.color ||
                theme.palette.content.main
              : theme.palette.card.main,
            height: "40px",
          }}
        >
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            displayEmpty // To allow display of 'None' even when value is empty
            sx={{
              color: selectedCategory ? "black" : theme.palette.text.main,
              height: "40px",
              ".MuiInputBase-input": {
                paddingTop: "5px",
                paddingBottom: "5px",
              },
              border: `1px solid ${theme.palette.text.main}`,
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3} sx={{ mt: 3 }}>
        <InputLabel sx={{ marginBottom: 2, marginLeft: 1 }}>Suche</InputLabel>

        <TextField
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchInputChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              height: "40px",
              ".MuiInputBase-input": {
                paddingTop: "5px",
                paddingBottom: "5px",
              },
              backgroundColor: theme.palette.card.main,
              border: `1px solid ${theme.palette.text.main}`,
            },
          }}
          sx={{
            ".MuiOutlinedInput-root": {
              height: "40px",
            },
            marginLeft: 1,
          }}
        />
      </Grid>
    </Grid>
  );
}

export default FilterTransactions;
