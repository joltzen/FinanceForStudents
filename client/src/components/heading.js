import React from "react";
import Typography from "@mui/material/Typography";

function Heading(props) {
  return (
    <Typography variant="h3" sx={{ fontWeight: "bold", color: "#e0e3e9" }}>
      {props.text}
    </Typography>
  );
}

export default Heading;
