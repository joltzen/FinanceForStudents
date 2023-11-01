import React from "react";
import Typography from "@mui/material/Typography";

function Heading(props) {
  return (
    <Typography variant="h1" sx={{ fontWeight: "bold" }}>
      {props.text}
    </Typography>
  );
}

export default Heading;
