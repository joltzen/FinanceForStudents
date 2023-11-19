/* Copyright 2023, Jason Oltzen */

import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import React from "react";

function Heading(props) {
  const theme = useTheme();
  return (
    <Typography
      variant="h3"
      sx={{ fontWeight: "bold", color: theme.palette.text.main }}
    >
      {props.text}
    </Typography>
  );
}

export default Heading;
