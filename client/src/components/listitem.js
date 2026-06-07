/* Copyright (c) 2026, Jason Oltzen */

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
  const isActive = window.location.pathname === props.href;

  return (
    <ListItem
      button
      component="a"
      href={props.href}
      sx={{
        backgroundColor: isActive ? "rgba(198,170,96,0.15)" : "transparent",
        borderLeft: isActive ? "3px solid #c6aa60" : "3px solid transparent",
        transition: "all 0.18s ease",
        mx: 0.5,
        borderRadius: "0 8px 8px 0",
        mb: 0.5,
        "&:hover": {
          backgroundColor: "rgba(198,170,96,0.10)",
          borderLeft: "3px solid rgba(198,170,96,0.6)",
        },
      }}
    >
      {props.icon && (
        <ListItemIcon
          sx={{
            color: isActive ? "#c6aa60" : "rgba(224,227,233,0.75)",
            minWidth: 40,
          }}
        >
          {props.icon}
        </ListItemIcon>
      )}
      <ListItemText>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: isActive ? 600 : 400,
            color: isActive ? "#e0e3e9" : "rgba(224,227,233,0.8)",
            letterSpacing: "0.01em",
          }}
        >
          {props.primary}
        </Typography>
      </ListItemText>
    </ListItem>
  );
}

export default StyledListItem;
