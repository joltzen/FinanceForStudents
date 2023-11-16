import { styled } from "@mui/system";
import { TextField } from "@mui/material";
const TextComp = styled(TextField)(({ theme }) => ({
  marginTop: "20px",
  "& label.Mui-focused": {
    color: theme.palette.text.main,
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
  backgroundColor: theme.palette.select.main,
  borderRadius: "5px",
  border: `1px solid ${theme.palette.text.main}`, // Use template literal for dynamic value
}));
export default TextComp;
