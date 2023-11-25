import DeleteIcon from "@mui/icons-material/Delete";
import { CardContent, Chip, Grid, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import LinearProgressComp from "../../components/LinearProgressComp";

function SavingCards({ goal, handleDelete, calculateSavingsProgress, theme }) {
  return (
    <CardContent>
      <Box position="relative" width="100%">
        <IconButton
          onClick={() => handleDelete(goal.id)}
          sx={{
            position: "absolute",
            top: 7,
            right: 0,
            color: theme.palette.text.main,
          }}
        >
          <DeleteIcon />
        </IconButton>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
              <strong>{goal.description}</strong>
            </Typography>
            <Typography
              variant="body2"
              component="div"
              color={theme.palette.text.main}
              gutterBottom
            >
              <strong>Monatliches Sparen: </strong> {goal.monthly_saving} €
            </Typography>
            <Typography
              variant="body2"
              component="div"
              color={theme.palette.text.main}
              gutterBottom
            >
              <strong>Gesamtbetrag:</strong> {goal.total_amount} €
            </Typography>
            <div>
              <Chip
                sx={{ color: theme.palette.text.main, mr: 1, mb: 2 }}
                label={`vom: ${new Date(goal.startdate).toLocaleDateString()}`}
              />
              <Chip
                sx={{ color: theme.palette.text.main, mb: 2 }}
                label={`bis: ${
                  goal.deadline
                    ? new Date(goal.deadline).toLocaleDateString()
                    : "Keine"
                }`}
              />
            </div>
            <Typography
              variant="body2"
              component="div"
              sx={{ color: theme.palette.text.main }}
            >
              <strong>Dauer:</strong> {goal.duration} Monate
            </Typography>
          </Grid>
        </Grid>
        <Typography
          variant="body2"
          component="div"
          sx={{ mt: 1, color: theme.palette.text.main }}
        >
          <strong>Ersparnisfortschritt:</strong>
        </Typography>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgressComp
            variant="determinate"
            value={calculateSavingsProgress(goal)}
          />
        </Box>
        <Typography variant="body2" sx={{ color: theme.palette.text.main }}>
          {`${calculateSavingsProgress(goal).toFixed(2)}%`}
        </Typography>
      </Box>
    </CardContent>
  );
}

export default SavingCards;
