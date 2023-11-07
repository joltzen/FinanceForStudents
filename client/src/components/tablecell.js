import React from "react";
import TableCell from "@mui/material/TableCell";

function StyledTableCell(props) {
  return (
    <TableCell
      sx={{
        backgroundColor: "#4e577b",
        color: "#e0e3e9",
        fontWeight: "bold",
        borderBottom: "1px solid black",
      }}
    >
      {props.text}
    </TableCell>
  );
}

export default StyledTableCell;
