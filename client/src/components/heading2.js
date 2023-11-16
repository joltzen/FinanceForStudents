import React from "react";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

function Heading2(props) {
  const theme = useTheme();

  return (
    <Typography
      variant="h5"
      sx={{ fontWeight: "bold", marginTop: 5, color: theme.palette.text.main }}
    >
      {props.text}
    </Typography>
  );
}

export default Heading2;
