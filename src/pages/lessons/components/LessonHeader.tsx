import { Box, Typography, Chip } from '@mui/material';
import { useState } from 'react';

interface LessonHeaderProps {
  title: string;
  imageUrl: string;
  language: string;
  lessonSeries?: {
    id: string;
    title: string;
    slug: string;
    description: string;
  };
}

export default function LessonHeader({ title, imageUrl, language, lessonSeries }: LessonHeaderProps) {
  const [flagError, setFlagError] = useState(false);

  return (
    <Box className="lesson-header">
      {!flagError && (
        <img 
          src={`/images/language_flags/${language}.png`}
          alt={`${language} flag`}
          className="lesson-header-flag-absolute"
          onError={() => setFlagError(true)}
        />
      )}
      <Box className="lesson-header-content">
        {lessonSeries && (
            <Box className="lesson-series-container">
              <Chip
                key={lessonSeries.id}
                label={lessonSeries.title}
                className="series-chip"
                variant="outlined"
              />
            </Box>
        )}
        <Box className="lesson-header-text">
          <Typography
            variant="h3"
            component="h1"
            className="lesson-page-title"
          >
            {title}
          </Typography>
        </Box>
      </Box>
      <Box className="lesson-header-media">
        <img src={imageUrl} alt={title} />
      </Box>
    </Box>
  );
} 