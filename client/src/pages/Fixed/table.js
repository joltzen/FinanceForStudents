/* Copyright (c) 2023, Jason Oltzen */

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import RowMenu from "../Finance/rowmenu";

function TransactionSection({
  transactions,
  filterMonth,
  filterYear,
  handleDeleteSettings,
  handleEditButtonClick,
  transactionType,
}) {
  const theme = useTheme();

  return (
    <TableContainer component={Paper} elevatiyon={10}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead
          sx={{
            backgroundColor: theme.palette.head.main,
          }}
        >
          <TableRow>
            <TableCell sx={{ color: theme.palette.tabletext.main }}>
              Beschreibung
            </TableCell>
            <TableCell sx={{ color: theme.palette.tabletext.main }}>
              Betrag
            </TableCell>
            <TableCell sx={{ width: "1px" }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ backgroundColor: theme.palette.content.main }}>
          {transactions
            .filter(
              (t) =>
                t?.transaction_type === transactionType &&
                t?.month === filterMonth &&
                t?.year === filterYear
            )
            ?.map((item) => (
              <TableRow key={item.settings_id}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.amount} €</TableCell>
                <TableCell align="right">
                  <RowMenu
                    settings={item}
                    handleEditButtonClick={() =>
                      handleEditButtonClick(item.settings_id)
                    }
                    handleDeleteTransaction={() =>
                      handleDeleteSettings(item.settings_id)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TransactionSection;
