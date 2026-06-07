import { Card, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";

function SaveCard({ theme, savingSum }) {
  return (
    <Card
      sx={{
        backgroundColor: theme.palette.card.main,
        boxShadow: theme.shadows[6],
        "&:hover": {
          boxShadow: theme.shadows[10],
        },
        height: "100%",
        marginRight: 2,
        borderRadius: 5,
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" sx={{ color: theme.palette.text.main }}>
              <strong>Gesamtausgaben diesen Monat:</strong>
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2 }}>
              {savingSum.toFixed(2)} €
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default SaveCard;
