import React from 'react';
import { Typography } from '@mui/material';
import { friendlyFetchError } from '../../utils/friendlyFetchError';

interface FetchErrorMessageProps {
  error: string | null | undefined;
  onRetry: () => void;
  title?: string;
  className?: string;
}

const FetchErrorMessage: React.FC<FetchErrorMessageProps> = ({ error, onRetry, title = 'Error', className = '' }) => (
  <div className={`cold-start-message cold-start-message-error ${className}`.trim()} style={{ width: '100%' }}>
    <Typography variant="h6" className="error-message" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1" className="error-message">
      {friendlyFetchError(error)}
    </Typography>
    <button className="retry-btn" onClick={onRetry}>
      Retry
    </button>
  </div>
);

export default FetchErrorMessage; 