import { Card } from "@mui/material";
import { styled } from "@mui/system";

const CardComp = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.card.main,
  color: theme.palette.secondary.main,
  boxShadow: theme.shadows[6],
  "&:hover": {
    boxShadow: theme.shadows[10],
  },
}));

export default CardComp;
