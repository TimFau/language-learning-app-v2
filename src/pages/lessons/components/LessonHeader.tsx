import { Box, Typography } from '@mui/material';

interface LessonHeaderProps {
  title: string;
  imageUrl: string;
  language: string;
}

export default function LessonHeader({ title, imageUrl, language }: LessonHeaderProps) {
  return (
    <Box className="lesson-header">
      <Box className="lesson-header-content">
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
      <Box className="lesson-header-media">
        <img src={imageUrl} alt={title} />
      </Box>
    </Box>
  );
} 