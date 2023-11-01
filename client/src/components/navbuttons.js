import React from "react";
import Button from "@mui/material/Button";

function NavButtons(props) {
  return (
    <Button
      color="inherit"
      href={props.path}
      sx={{ color: "#d8c690", marginLeft: 5 }}
    >
      {props.text}
    </Button>
  );
}

export default NavButtons;
