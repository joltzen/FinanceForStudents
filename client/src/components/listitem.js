import React from "react";
import { ListItem, ListItemText, Typography } from "@mui/material";

function StyledListItem(props) {
  return (
    <ListItem
      button
      component="a"
      href={props.href}
      sx={{
        backgroundColor: "white",
        "&:hover": { backgroundColor: "lightgrey" },
      }}
    >
      <ListItemText>
        <Typography sx={{ mx: 0.5, fontSize: "18px", width: 200 }}>
          {props.primary}
        </Typography>
      </ListItemText>
    </ListItem>
  );
}

export default StyledListItem;
