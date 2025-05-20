import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

interface ResumeProgressDialogProps {
  open: boolean;
  onResume: () => void;
  onStartOver: () => void;
}

const ResumeProgressDialog: React.FC<ResumeProgressDialogProps> = ({ open, onResume, onStartOver }) => (
  <Dialog
    open={open}
    aria-labelledby="resume-progress-dialog-title"
    aria-describedby="resume-progress-dialog-description"
  >
    <DialogTitle id="resume-progress-dialog-title">
      Resume Progress?
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="resume-progress-dialog-description">
        You have unfinished progress in this deck. Would you like to resume where you left off or start over?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onStartOver} color="error" data-testid="startover-deck-button">
        Start Over
      </Button>
      <Button onClick={onResume} variant="contained" data-testid="resume-deck-button" autoFocus>
        Resume
      </Button>
    </DialogActions>
  </Dialog>
);

export default ResumeProgressDialog; 