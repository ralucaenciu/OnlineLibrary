import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
} from "@mui/material";

function Confirm({
  open,
  onNo,
  onYes,
  title = "Ești sigur?",
  body = "Ești sigur?",
  noText = "Nu",
  yesText = "Da",
}) {
  return (
    <Dialog
      open={open}
      onClose={onNo}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {body}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onNo}>{noText}</Button>
        <Button onClick={onYes} autoFocus>
          {yesText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Confirm;
