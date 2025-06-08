import { Box, Typography, Chip } from '@mui/material';

interface LessonHeaderProps {
  title: string;
  imageUrl: string;
  language: string;
  series?: string[];
}

export default function LessonHeader({ title, imageUrl, language, series }: LessonHeaderProps) {
  return (
    <Box className="lesson-header">
      <Box className="lesson-header-content">
        {series && series.length > 0 && (
            <Box className="lesson-series-container">
              {series.map((seriesName, index) => (
                <Chip
                  key={index}
                  label={seriesName}
                  className="series-chip"
                  variant="outlined"
                />
              ))}
            </Box>
        )}
        <Box className="lesson-header-text">
          <img 
            src={`/images/language_flags/${language}.png`}
            alt={`${language} flag`}
            className="lesson-header-flag"
          />
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