import React from "react";
import Typography from "@mui/material/Typography";

function Heading2(props) {
  return (
    <Typography variant="h4" sx={{ fontWeight: "bold", marginTop: 5 }}>
      {props.text}
    </Typography>
  );
}

export default Heading2;
