/* Copyright (c) 2023, Jason Oltzen */

import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EastIcon from "@mui/icons-material/East";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { months, years } from "../../config/constants";
import TransactionSection from "./transactionselect";
import TransferDialog from "./transferdialog";

function FilterCard({
  theme,
  selectedTab,
  handleTabChange,
  handleDialog,
  handleMonthChange,
  filterMonth,
  setFilterMonth,
  setFilterYear,
  filterYear,
  openTransferDialog,
  handleTransferDialogOpen,
  handleTransferDialogClose,
  handleTransferSubmit,
  transactions,
  handleDeleteSettings,
  handleEditButtonClick,
}) {
  return (
    <Grid item xs={12} sm={8} md={6} lg={8} style={{ minHeight: "100%" }}>
      <Card
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: theme.palette.left.main,
        }}
      >
        <CardContent
          style={{
            display: "flex",
            flexDirection: "column",

            padding: 10,
            height: "100%",
          }}
        >
          <Box sx={{ width: "100%", mt: 4 }}>
            <Typography
              variant="h4"
              color={theme.palette.text.main}
              sx={{ mt: 2, mb: 2 }}
            >
              Fixkosten
            </Typography>
          </Box>
          <Box sx={{ width: "100%", marginTop: 3, marginBottom: 20 }}>
            <Card
              sx={{
                marginBottom: theme.spacing(3),
                backgroundColor: theme.palette.card.main,
                color: theme.palette.secondary.main,
                borderRadius: "10px",
                boxShadow: theme.shadows[6],
                "&:hover": {
                  boxShadow: theme.shadows[10],
                },
              }}
            >
              <CardContent>
                <Box sx={{ marginTop: 3, marginBottom: 3 }}>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-around"
                  >
                    <Grid item>
                      <IconButton
                        sx={{ mt: 3 }}
                        onClick={() => handleMonthChange("prev")}
                      >
                        <ChevronLeftIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={3}>
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
                    <Grid item xs={3}>
                      <InputLabel sx={{ marginBottom: 2, marginLeft: 1 }}>
                        Jahr
                      </InputLabel>
                      <FormControl
                        fullWidth
                        sx={{
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
                    <Grid item>
                      <IconButton
                        sx={{ mt: 3 }}
                        onClick={() => handleMonthChange("next")}
                      >
                        <ChevronRightIcon />
                      </IconButton>
                    </Grid>
                    <Grid item sx={{ marginLeft: 40 }}>
                      <IconButton
                        variant="contained"
                        onClick={handleTransferDialogOpen}
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          boxShadow: 5,
                          mt: 3,
                        }}
                      >
                        <Tooltip title="Fixkosten übertragen">
                          <EastIcon
                            sx={{ color: theme.palette.common.white }}
                          />
                        </Tooltip>
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton
                        variant="contained"
                        onClick={handleDialog}
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          boxShadow: 5,
                          marginLeft: 3,
                          mt: 3,
                        }}
                      >
                        <Tooltip title="Fixkosten hinzufügen">
                          <AddIcon sx={{ color: theme.palette.common.white }} />
                        </Tooltip>
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  aria-label="Income and Expenses Tabs"
                  variant="fullWidth"
                  sx={{
                    backgroundColor: theme.palette.list.main,
                    color: theme.palette.text.main,
                    ".MuiTabs-indicator": {
                      backgroundColor: theme.palette.indicator.main,
                    },
                    boxShadow:
                      "0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)",
                    borderRadius: "50px",
                    marginBottom: 2,
                    ".MuiTab-root": {
                      color: theme.palette.text.main,
                      fontWeight: "bold",
                      marginRight: 2,
                      "&.Mui-selected": {
                        color: theme.palette.indicator.main,
                        borderBottom: `2px solid ${theme.palette.selected.main}`,
                      },
                    },
                  }}
                >
                  <Tab label="Einnahmen" />
                  <Tab label="Ausgaben" />
                </Tabs>
              </CardContent>
            </Card>
            <TransferDialog
              open={openTransferDialog}
              handleClose={handleTransferDialogClose}
              handleSubmit={handleTransferSubmit}
              months={months}
              years={years}
            />
            {selectedTab === 0 && (
              <TransactionSection
                transactions={transactions}
                filterMonth={filterMonth}
                filterYear={filterYear}
                handleDeleteSettings={handleDeleteSettings}
                handleEditButtonClick={handleEditButtonClick}
                transactionType="Einnahme"
              />
            )}
            {selectedTab === 1 && (
              <TransactionSection
                transactions={transactions}
                filterMonth={filterMonth}
                filterYear={filterYear}
                handleDeleteSettings={handleDeleteSettings}
                handleEditButtonClick={handleEditButtonClick}
                transactionType="Ausgabe"
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default FilterCard;
