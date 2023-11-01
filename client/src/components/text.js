import React from "react";
import Typography from "@mui/material/Typography";

function Text(props) {
  return (
    <Typography variant="body1" sx={{ fontSize: "1.5rem", marginTop: 2 }}>
      {props.text}
    </Typography>
  );
}

export default Text;
