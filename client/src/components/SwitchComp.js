import { Switch, styled } from "@mui/material";

const SwitchComp = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase": {
    color: "grey",
    "&.Mui-checked": {
      color: "#be9e44",
    },
    "&.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#be9e44",
    },
  },
  "& .MuiSwitch-track": {
    backgroundColor: "grey",
  },
}));

export default SwitchComp;
