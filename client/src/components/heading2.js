import React from "react";
import Typography from "@mui/material/Typography";

function Heading2(props) {
  return (
    <Typography
      variant="h5"
      sx={{ fontWeight: "bold", marginTop: 5, color: "#e0e3e9" }}
    >
      {props.text}
    </Typography>
  );
}

export default Heading2;
