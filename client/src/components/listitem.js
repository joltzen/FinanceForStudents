/* Copyright (c) 2023, Jason Oltzen */

import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

function StyledListItem(props) {
  const theme = useTheme();

  return (
    <ListItem
      button
      component="a"
      href={props.href}
      sx={{
        backgroundColor: "#333740",
        "&:hover": { backgroundColor: "#3A415C" },
      }}
    >
      {props.icon && (
        <ListItemIcon sx={{ color: "white" }}>{props.icon}</ListItemIcon>
      )}
      <ListItemText>
        <Typography
          sx={{
            mx: 0.5,
            fontSize: "15px",
            width: 200,
            color: "#e0e3e9",
          }}
        >
          {props.primary}
        </Typography>
      </ListItemText>
    </ListItem>
  );
}

export default StyledListItem;
