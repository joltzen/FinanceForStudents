import React from "react";
import TableCell from "@mui/material/TableCell";

function StyledTableCell(props) {
  return (
    <TableCell
      sx={{
        backgroundColor: "#4e577b",
        color: "white",
        fontWeight: "bold",
        borderBottom: "1px solid black",
      }}
    >
      {props.text}
    </TableCell>
  );
}

export default StyledTableCell;
