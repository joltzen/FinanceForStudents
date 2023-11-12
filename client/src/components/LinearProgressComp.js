import { LinearProgress } from "@mui/material";
import { styled } from "@mui/system";

const LinearProgressComp = styled(LinearProgress)({
  height: 10,
  borderRadius: 5,
  [`& .MuiLinearProgress-barColorPrimary`]: {
    backgroundColor: "#be9e44", 
  },
  [`& .MuiLinearProgress-colorPrimary`]: {
    backgroundColor: "#cbb26a", 
  },
});

export default LinearProgressComp;
