/* Copyright (c) 2023, Jason Oltzen */

import { LinearProgress } from "@mui/material";
import { styled } from "@mui/system";

const LinearProgressComp = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`& .MuiLinearProgress-barColorPrimary`]: {
    backgroundColor: theme.palette.secondary.main,
  },
  [`& .MuiLinearProgress-colorPrimary`]: {
    backgroundColor: theme.palette.secondary.light,
  },
}));

export default LinearProgressComp;
