/* Copyright (c) 2023, Jason Oltzen */

import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";

function RowMenu({ settings, handleEditButtonClick, handleDeleteTransaction }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
      >
        <MoreHorizRoundedIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: "20ch",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleEditButtonClick(settings.settings_id);
            handleClose();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem onClick={handleClose}>Move</MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteTransaction} style={{ color: "red" }}>
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}

export default RowMenu;
