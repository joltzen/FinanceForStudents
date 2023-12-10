import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
const BudgetWarningDialog = ({
  showBudgetWarningDialog,
  setShowBudgetWarningDialog,
  handleSubmit,
  theme,
}) => (
  <Dialog
    open={showBudgetWarningDialog}
    onClose={() => setShowBudgetWarningDialog(false)}
    sx={{
      color: theme.palette.text.main,
    }}
  >
    <DialogTitle sx={{ color: theme.palette.secondary.main }}>
      Warnung!
    </DialogTitle>
    <DialogContent>
      <p>
        Dieser Betrag überschreitet Ihren monatlich festgelegten Grenzwert für
        die ausgewählte Kategorie. Möchten Sie trotzdem fortfahren?
      </p>
    </DialogContent>
    <DialogActions>
      <Button
        variant="contained"
        onClick={() => setShowBudgetWarningDialog(false)}
      >
        Abbrechen
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          setShowBudgetWarningDialog(false);
          handleSubmit();
        }}
      >
        Fortfahren
      </Button>
    </DialogActions>
  </Dialog>
);

export default BudgetWarningDialog;
