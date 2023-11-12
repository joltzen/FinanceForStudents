import { styled } from "@mui/system";
import { TextField } from "@mui/material";
const TextComp = styled(TextField)({
  marginTop: "20px",
  "& label.Mui-focused": {
    color: "#e0e3e9",
  },
  "& label": {
    color: "#e0e3e9",
  },
  "& input": {
    color: "#e0e3e9",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#373c47",
    },
    "&:hover fieldset": {
      borderColor: "373c47",
    },
    "&.Mui-focused fieldset": {
      borderColor: "373c47",
    },
  },
  backgroundColor: "#2e2e38",
  borderRadius: "5px",
  border: "1px solid #e0e3e9",
});
export default TextComp;
