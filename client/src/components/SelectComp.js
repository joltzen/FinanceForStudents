import { Select } from "@mui/material";
import { styled } from "@mui/system";

const SelectComp = styled(Select)(({ theme }) => ({
  color: theme.palette.text.main,
  backgroundColor: theme.palette.select.main,
  border: `1px solid ${theme.palette.text.main}`,
  "& .MuiSvgIcon-root": { color: theme.palette.text.main },
}));
export default SelectComp;
