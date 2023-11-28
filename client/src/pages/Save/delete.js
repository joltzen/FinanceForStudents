import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
function DeleteDialog({
  openConfirmDialog,
  setOpenConfirmDialog,
  confirmDelete,
}) {
  return (
    <Dialog
      open={openConfirmDialog}
      onClose={() => setOpenConfirmDialog(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Sparziel löschen"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Bist Du sicher, dass Du dieses Sparziel löschen möchtest?
          <br />
          Dieser Vorgang kann nicht rückgängig gemacht werden.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => setOpenConfirmDialog(false)}
          color="primary"
        >
          Abbrechen
        </Button>
        <Button
          variant="contained"
          onClick={confirmDelete}
          color="primary"
          autoFocus
        >
          Löschen
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
