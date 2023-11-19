/* Copyright (c) 2023, Jason Oltzen */

import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import React from "react";

function Text(props) {
  const theme = useTheme();

  return (
    <Typography
      variant="body1"
      sx={{ marginTop: 2, color: theme.palette.text.main }}
    >
      {props.text}
    </Typography>
  );
}

export default Text;
