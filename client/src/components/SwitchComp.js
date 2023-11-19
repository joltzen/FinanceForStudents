/* Copyright (c) 2023, Jason Oltzen */

import { Switch, styled } from "@mui/material";

const SwitchComp = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase": {
    color: "grey",
    "&.Mui-checked": {
      color: theme.palette.secondary.main,
    },
    "&.Mui-checked + .MuiSwitch-track": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  "& .MuiSwitch-track": {
    backgroundColor: "grey",
  },
}));

export default SwitchComp;
