import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

interface WordActionSheetProps {
  open: boolean;
  onClose: () => void;
  word: string;
  translation: string;
  onWordReference: () => void;
  onSpeak: () => void;
  language: 'spanish' | 'french' | 'german';
}

export default function WordActionSheet({
  open,
  onClose,
  word,
  translation,
  onWordReference,
  onSpeak,
  language
}: WordActionSheetProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          position: 'fixed',
          bottom: 0,
          m: 0,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          width: '100%'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div">
          {word}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {translation}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ py: 0 }}>
        <Button
          fullWidth
          onClick={onSpeak}
          startIcon={<VolumeUpIcon />}
          sx={{ justifyContent: 'flex-start', mb: 1 }}
        >
          Pronounce in {language.charAt(0).toUpperCase() + language.slice(1)}
        </Button>
        <Button
          fullWidth
          onClick={onWordReference}
          sx={{ justifyContent: 'flex-start' }}
        >
          View on WordReference
        </Button>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} fullWidth variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
} 