import React from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

function StyledListItem(props) {
  const theme = useTheme();

  return (
    <ListItem
      button
      component="a"
      href={props.href}
      sx={{
        backgroundColor: theme.palette.list.main,
        "&:hover": { backgroundColor: theme.palette.primary.main },
      }}
    >
      {props.icon && (
        <ListItemIcon sx={{ color: theme.palette.iconlist.default }}>
          {props.icon}
        </ListItemIcon>
      )}
      <ListItemText>
        <Typography
          sx={{
            mx: 0.5,
            fontSize: "15px",
            width: 200,
            color: theme.palette.text.main,
          }}
        >
          {props.primary}
        </Typography>
      </ListItemText>
    </ListItem>
  );
}

export default StyledListItem;
