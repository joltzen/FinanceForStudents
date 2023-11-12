import { Card } from "@mui/material";
import { styled } from "@mui/system";

const CardComp = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: "#262b3d",
  color: "#be9e44",
  boxShadow: theme.shadows[6],
  "&:hover": {
    boxShadow: theme.shadows[10],
  },
}));

export default CardComp;
