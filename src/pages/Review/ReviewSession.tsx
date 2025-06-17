import React, { useState } from 'react';
import { useAuth } from 'hooks/useAuth';
import { useReviewSession } from './hooks/useReviewSession';
import {
  Button,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';

const ReviewSession = () => {
  const { user } = useAuth();
  const {
    sessionState,
    options,
    terms,
    currentTerm,
    currentCardIndex,
    loading,
    error,
    startSession,
    restartSession,
    recordResponse,
    updateOptions,
  } = useReviewSession({ userId: user?.id || '' });

  const [isFlipped, setIsFlipped] = useState(false);

  // Determine what appears on each side of the flashcard based on the selected review direction
  const getCardTexts = () => {
    if (!currentTerm) return { front: '', back: '' };
    return options.direction === 'term_to_definition'
      ? { front: currentTerm.term, back: currentTerm.definition }
      : { front: currentTerm.definition, back: currentTerm.term };
  };

  const handleFlip = () => {
    if (sessionState === 'active') {
      setIsFlipped(!isFlipped);
    }
  };

  const handleResponse = (rating: 'hard' | 'okay' | 'easy') => {
    if (currentTerm) {
      recordResponse(currentTerm.id, rating);
      setIsFlipped(false);
    }
  };

  if (!user) {
    return <Typography>Please log in to start a review session.</Typography>;
  }

  if (sessionState === 'configuring') {
    return (
      <Box className="review-config">
        <Typography variant="h4">Setup Review</Typography>
        <Select
          value={options.language}
          onChange={(e) => updateOptions({ language: e.target.value })}
        >
          <MenuItem value="all">All Languages</MenuItem>
          {/* TODO: Populate with user's languages */}
        </Select>
        <Select
          value={options.cardCount}
          onChange={(e) => updateOptions({ cardCount: Number(e.target.value) })}
        >
          <MenuItem value={10}>10 Cards</MenuItem>
          <MenuItem value={25}>25 Cards</MenuItem>
          <MenuItem value={50}>50 Cards</MenuItem>
        </Select>
        <Select
          value={options.direction}
          onChange={(e) =>
            updateOptions({ direction: e.target.value as 'term_to_definition' | 'definition_to_term' })
          }
        >
          <MenuItem value="term_to_definition">English → Translation</MenuItem>
          <MenuItem value="definition_to_term">Translation → English</MenuItem>
        </Select>
        <Button variant="contained" onClick={startSession}>
          Start Review
        </Button>
      </Box>
    );
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  if (sessionState === 'finished') {
    return (
      <Box className="review-summary">
        <Typography variant="h4">Session Complete!</Typography>
        <Typography>You reviewed {terms.length} terms.</Typography>
        <Button variant="contained" onClick={restartSession}>
          Review Again
        </Button>
      </Box>
    );
  }

  if (sessionState === 'active' && currentTerm) {
    const { front, back } = getCardTexts();
    return (
      <Box className="review-active">
        <Box className="progress-bar">
          <Typography>
            Card {currentCardIndex + 1} of {terms.length}
          </Typography>
        </Box>
        <Box className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
          <Box className="card-inner">
            <Box className="card-front">
              <Typography variant="h2">{front}</Typography>
            </Box>
            <Box className="card-back">
              <Typography variant="h3">{back}</Typography>
            </Box>
          </Box>
        </Box>
        {isFlipped && (
          <Box className="response-buttons">
            <Button onClick={() => handleResponse('hard')}>Hard</Button>
            <Button onClick={() => handleResponse('okay')}>Okay</Button>
            <Button onClick={() => handleResponse('easy')}>Easy</Button>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box className="review-empty">
        <Typography variant="h5">No terms found for this review session.</Typography>
        <Typography>Try adjusting your filters or adding more words to your Word Bank.</Typography>
        <Button variant="contained" onClick={restartSession}>
          Back to Setup
        </Button>
      </Box>
  );
};

export default ReviewSession; 