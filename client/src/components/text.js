import React from "react";
import Typography from "@mui/material/Typography";

function Text(props) {
  return (
    <Typography variant="body1" sx={{ marginTop: 2, color: "#e0e3e9" }}>
      {props.text}
    </Typography>
  );
}

export default Text;
