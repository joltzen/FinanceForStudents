/* Copyright (c) 2023, Jason Oltzen */

import TableCell from "@mui/material/TableCell";
import { useTheme } from "@mui/material/styles";
import React from "react";

function StyledTableCell(props) {
  const theme = useTheme();
  return (
    <TableCell
      sx={{
        backgroundColor: theme.palette.table.main,
        color: theme.palette.tabletext.main,
        fontWeight: "bold",
        borderBottom: "1px solid black",
        width: props.width,
        height: "2px",
      }}
    >
      {props.text}
    </TableCell>
  );
}

export default StyledTableCell;
