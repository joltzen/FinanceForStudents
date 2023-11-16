import React from "react";
import TableCell from "@mui/material/TableCell";
import { useTheme } from "@mui/material/styles";

function StyledTableCell(props) {
  const theme = useTheme();
  return (
    <TableCell
      sx={{
        backgroundColor: theme.palette.tablecell.main,
        color: theme.palette.text.main,
        fontWeight: "bold",
        borderBottom: "1px solid black",
        width: "20px",
      }}
    >
      {props.text}
    </TableCell>
  );
}

export default StyledTableCell;
