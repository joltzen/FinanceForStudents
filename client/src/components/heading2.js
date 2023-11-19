/* Copyright (c) 2023, Jason Oltzen */

import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import React from "react";

function Heading2(props) {
  const theme = useTheme();

  return (
    <Typography
      variant="h5"
      sx={{
        fontWeight: "bold",
        marginTop: 1,
        ml: 2,
        color: theme.palette.text.main,
      }}
    >
      {props.text}
    </Typography>
  );
}

export default Heading2;
