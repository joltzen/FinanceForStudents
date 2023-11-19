/* Copyright 2023, Jason Oltzen */

import { Button } from "@mui/material";
import { styled } from "@mui/system";

const AddButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.primary.main),
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  position: "fixed",
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  [theme.breakpoints.up("sm")]: {
    right: theme.spacing(10),
  },
}));

export default AddButton;
