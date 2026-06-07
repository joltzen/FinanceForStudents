/* Copyright (c) 2023, Jason Oltzen */

import Button from "@mui/material/Button";
import React from "react";

function NavButtons(props) {

  return (
    <Button
      color="inherit"
      href={props.path}
      variant="outlined"
      size="small"
      sx={{
        color: "#c6aa60",
        borderColor: "rgba(198,170,96,0.45)",
        marginLeft: 1.5,
        fontWeight: 600,
        "&:hover": {
          borderColor: "#c6aa60",
          backgroundColor: "rgba(198,170,96,0.08)",
        },
      }}
    >
      {props.text}
    </Button>
  );
}

export default NavButtons;
