import { Typography, LinearProgress } from '@mui/material';

interface ColdStartMessageProps {
  message?: string;
  maxSeconds?: number;
}

export default function ColdStartMessage({
  message = 'Our backend is starting up to save energy. This can take',
  maxSeconds = 30,
}: ColdStartMessageProps) {
  return (
    <div className="decks-container">
      <div className="cold-start-message">
        <Typography variant="h6" component="p" gutterBottom>
          Waking up the server...
        </Typography>
        <LinearProgress color="secondary" style={{ margin: '16px 0' }} />
        <Typography variant="body1">
          {message} <b>up to {maxSeconds} seconds</b> if it hasn't been used in a while.<br /><br />
          Thanks for your patience—this only happens on your first visit after some time away!
        </Typography>
      </div>
    </div>
  );
} 