/* Copyright (c) 2023, Jason Oltzen */

import { TextField } from "@mui/material";
import { styled } from "@mui/system";
const TextComp = styled(TextField)(({ theme }) => ({
  marginTop: "20px",
  "& label.Mui-focused": {
    color: theme.palette.selectBackground.main,
  },
  "& label": {
    color: theme.palette.text.main,
  },
  "& input": {
    color: theme.palette.text.main,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.border.main,
    },
    "&:hover fieldset": {
      borderColor: "373c47",
    },
    "&.Mui-focused fieldset": {
      borderColor: "373c47",
    },
  },
  backgroundColor: theme.palette.selectBackground.main,
  borderRadius: "5px",
  border: `1px solid ${theme.palette.text.main}`, // Use template literal for dynamic value
}));
export default TextComp;
