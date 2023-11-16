import React from "react";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";

function NavButtons(props) {
  const theme = useTheme();

  return (
    <Button
      color="inherit"
      href={props.path}
      sx={{ color: theme.palette.icon.main, marginLeft: 5 }}
    >
      {props.text}
    </Button>
  );
}

export default NavButtons;
