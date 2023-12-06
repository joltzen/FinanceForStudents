/* Copyright (c) 2023, Jason Oltzen */

import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import { months, years } from "../../config/constants";
import { Filtercards } from "./filtercards";
import TransactionSection from "./table";
import TransferDialog from "./transfer";

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
            <Filtercards
              handleMonthChange={handleMonthChange}
              filterMonth={filterMonth}
              setFilterMonth={setFilterMonth}
              filterYear={filterYear}
              setFilterYear={setFilterYear}
              handleTransferDialogOpen={handleTransferDialogOpen}
              handleDialog={handleDialog}
              selectedTab={selectedTab}
              handleTabChange={handleTabChange}
            />
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
