 /* Copyright 2023, Jason Oltzen */

import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import React from "react";

function NavButtons(props) {
  const theme = useTheme();

  return (
    <Button
      color="inherit"
      href={props.path}
      sx={{ color: "#c6aa60", marginLeft: 5 }}
    >
      {props.text}
    </Button>
  );
}

export default NavButtons;
