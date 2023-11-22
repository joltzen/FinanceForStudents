/* Copyright (c) 2023, Jason Oltzen */

import Button from "@mui/material/Button";
import React from "react";

function NavButtons(props) {

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
