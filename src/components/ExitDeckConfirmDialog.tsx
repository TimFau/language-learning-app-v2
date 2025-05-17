import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import React from 'react';

interface ExitDeckConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ExitDeckConfirmDialog: React.FC<ExitDeckConfirmDialogProps> = ({ open, onClose, onConfirm }) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="exit-deck-dialog-title"
    aria-describedby="exit-deck-dialog-description"
  >
    <DialogTitle id="exit-deck-dialog-title">
      Exit Deck?
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="exit-deck-dialog-description">
        Are you sure you want to exit the deck? <br />
        <strong>Your progress is saved on this device.</strong> You can pick up where you left off if you resume this deck on the same device.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} data-testid="cancel-exit-deck-button">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="error" autoFocus data-testid="confirm-exit-deck-button">
        Exit Deck
      </Button>
    </DialogActions>
  </Dialog>
);

export default ExitDeckConfirmDialog; 