import { Box, Typography } from '@mui/material';

interface LessonHeaderProps {
  title: string;
  imageUrl: string;
}

export default function LessonHeader({ title, imageUrl }: LessonHeaderProps) {
  return (
    <Box className="lesson-header">
      <Box className="lesson-header-content">
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