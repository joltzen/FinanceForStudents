/* Copyright (c) 2026, Jason Oltzen */

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import StarIcon from "@mui/icons-material/Star";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import {
  Box,
  Chip,
  IconButton,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import RowMenu from "./rowmenu";

function TransactionsTable({
  toggleSortOrder,
  toggleSortOrderAmount,
  sortOrder,
  sortOrderAmount,
  finalTransactions,
  categories,
  savingSum,
  handleEditButtonClick,
  handleDeleteTransaction,
  formatDate,
  handleAddFavorites,
  handleDeleteFavorites,
  favorites,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handlePageChange = (_, value) => setPage(value);
  const handleChangeRowsPerPage = (e) => {
    const v = e.target.value;
    setRowsPerPage(v === "all" ? finalTransactions.length : parseInt(v, 10));
    setPage(1);
  };

  const pageCount = Math.ceil(finalTransactions.length / rowsPerPage);
  const displayed = finalTransactions.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const headCellSx = {
    color: isDark ? "rgba(224,227,233,0.55)" : "rgba(44,47,54,0.55)",
    fontWeight: 700,
    fontSize: "0.7rem",
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
    py: 1.5,
    backgroundColor: isDark ? "rgba(30,35,56,0.6)" : "rgba(78,87,123,0.06)",
  };

  return (
    <Box>
      <TableContainer
        sx={{
          borderRadius: 3,
          border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
          overflow: "hidden",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headCellSx, width: 6, pl: 2 }} />
              <TableCell sx={headCellSx}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  Datum
                  <IconButton
                    onClick={toggleSortOrder}
                    size="small"
                    sx={{ color: "inherit", opacity: 0.7, p: 0.25 }}
                  >
                    <ArrowUpwardIcon
                      sx={{
                        fontSize: 13,
                        transform:
                          sortOrder === "asc" ? "none" : "rotate(180deg)",
                        transition: "transform 0.2s",
                      }}
                    />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell sx={headCellSx}>Beschreibung</TableCell>
              <TableCell sx={headCellSx}>Kategorie</TableCell>
              <TableCell sx={{ ...headCellSx, textAlign: "right" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 0.5,
                  }}
                >
                  Betrag
                  <IconButton
                    onClick={toggleSortOrderAmount}
                    size="small"
                    sx={{ color: "inherit", opacity: 0.7, p: 0.25 }}
                  >
                    <ArrowUpwardIcon
                      sx={{
                        fontSize: 13,
                        transform:
                          sortOrderAmount === "asc" ? "none" : "rotate(180deg)",
                        transition: "transform 0.2s",
                      }}
                    />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell sx={{ ...headCellSx, width: 36 }} />
              <TableCell sx={{ ...headCellSx, width: 36 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {displayed.map((transaction) => {
              const cat = categories.find(
                (c) => c.id === transaction.category_id,
              );
              const isAusgabe = transaction.transaction_type === "Ausgabe";
              const isFav = favorites.some(
                (f) =>
                  (f.transaction_id === transaction.transaction_id &&
                    f.user_id === transaction.user_id) ||
                  transaction.favorites === true,
              );
              const rowBg = isDark ? "rgba(38,43,61,1)" : "#ffffff";

              return (
                <TableRow
                  key={transaction.transaction_id}
                  sx={{
                    backgroundColor: rowBg,
                    "&:hover": {
                      backgroundColor: isDark
                        ? "rgba(50,56,78,0.8)"
                        : "rgba(78,87,123,0.04)",
                    },
                    transition: "background-color 0.12s",
                    "&:last-child td": { border: 0 },
                  }}
                >
                  <TableCell sx={{ pl: 2, pr: 0, py: 1.5 }}>
                    <Box
                      sx={{
                        width: 3,
                        height: 28,
                        borderRadius: 4,
                        backgroundColor:
                          cat?.color ||
                          (isAusgabe
                            ? theme.palette.error.main
                            : theme.palette.success.main),
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      py: 1.5,
                      whiteSpace: "nowrap",
                      fontSize: "0.83rem",
                      color: isDark ? "#b0b6c8" : "#666",
                    }}
                  >
                    {formatDate(transaction.transaction_date)}
                  </TableCell>
                  <TableCell sx={{ py: 1.5, maxWidth: 240 }}>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ color: theme.palette.text.main, fontWeight: 500 }}
                    >
                      {transaction.description}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    {cat && (
                      <Chip
                        label={cat.name}
                        size="small"
                        sx={{
                          backgroundColor: `${cat.color}28`,
                          color: cat.color,
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          height: 20,
                          borderRadius: "5px",
                          border: `1px solid ${cat.color}44`,
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell
                    sx={{ py: 1.5, textAlign: "right", whiteSpace: "nowrap" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: isAusgabe ? "#ef5350" : "#66bb6a",
                        fontFeatureSettings: '"tnum"',
                      }}
                    >
                      {isAusgabe ? "−" : "+"}{" "}
                      {parseFloat(transaction.amount).toFixed(2)} €
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1, px: 0.5 }}>
                    <RowMenu
                      transaction={transaction}
                      handleEditButtonClick={handleEditButtonClick}
                      handleDeleteTransaction={() =>
                        handleDeleteTransaction(transaction.transaction_id)
                      }
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1, px: 0.5 }}>
                    <Tooltip
                      title={isFav ? "Favorit entfernen" : "Als Favorit merken"}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          isFav
                            ? handleDeleteFavorites(transaction)
                            : handleAddFavorites(transaction)
                        }
                        sx={{
                          color: isFav
                            ? "#c6aa60"
                            : isDark
                              ? "rgba(255,255,255,0.25)"
                              : "rgba(0,0,0,0.2)",
                          transition: "color 0.15s",
                        }}
                      >
                        {isFav ? (
                          <StarIcon sx={{ fontSize: 17 }} />
                        ) : (
                          <StarBorderOutlinedIcon sx={{ fontSize: 17 }} />
                        )}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {displayed.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  sx={{
                    textAlign: "center",
                    py: 8,
                    color: theme.palette.text.main,
                    opacity: 0.35,
                    fontSize: "0.9rem",
                  }}
                >
                  Keine Transaktionen für diesen Zeitraum
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 2,
          px: 0.5,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.main, opacity: 0.45 }}
          >
            Zeilen:
          </Typography>
          <Select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            variant="standard"
            size="small"
            sx={{
              fontSize: "0.8rem",
              color: theme.palette.text.main,
              minWidth: 44,
            }}
          >
            {[5, 10, 15, 20].map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
            <MenuItem value="all">Alle</MenuItem>
          </Select>
        </Box>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handlePageChange}
          size="small"
          sx={{
            "& .Mui-selected": {
              backgroundColor: `${theme.palette.primary.main} !important`,
              color: "#fff",
            },
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: isDark ? "rgba(224,227,233,0.45)" : "rgba(44,47,54,0.45)",
            }}
          >
            Saldo
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: savingSum >= 0 ? "#66bb6a" : "#ef5350",
              fontFeatureSettings: '"tnum"',
            }}
          >
            {savingSum >= 0 ? "+" : ""}
            {savingSum.toFixed(2)} €
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default TransactionsTable;
