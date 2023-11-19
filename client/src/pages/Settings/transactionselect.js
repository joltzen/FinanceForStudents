import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import {
  Divider,
  IconButton,
  Menu,
  MenuItem,
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
    <TableContainer component={Paper} elevation={10}>
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

function RowMenu({ settings, handleEditButtonClick, handleDeleteTransaction }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
      >
        <MoreHorizRoundedIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: "20ch",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleEditButtonClick(settings.settings_id);
            handleClose();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem onClick={handleClose}>Move</MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteTransaction} style={{ color: "red" }}>
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}

export default TransactionSection;
