import { useParams, useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import 'css/pages/lesson.scss';
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Skeleton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LESSON_CORE_FIELDS } from '../../services/graphql/fragments/lessonFragments';
import ColdStartMessage from '../../components/ColdStartMessage';
import { COLD_START_TIMEOUT } from '../../utils/constants';
import LessonContent from './components/LessonContent';
import LessonHeader from './components/LessonHeader';

const GET_LESSON = gql`
  query GetLesson($language: String!, $slug: String!) {
    lessons(filter: { language: { _eq: $language }, slug: { _eq: $slug } }) {
      ...LessonCoreFields
      body
      deck_link
      lesson_content
    }
  }
  ${LESSON_CORE_FIELDS}
`;

function LessonSkeleton() {
  return (
    <Box className="page-container lesson-page-container">
      <Container maxWidth="md">
        <Box className="lesson-page-back-button">
          <Skeleton variant="rectangular" width={150} height={36} />
        </Box>
        <Card className="lesson-page-card">
          <Box className="lesson-header">
            <Box className="lesson-header-content">
              <Skeleton variant="rectangular" width={24} height={24} className="lesson-header-flag" />
              <Typography variant="h3" component="h1" className="lesson-page-title">
                <Skeleton width="80%" />
              </Typography>
            </Box>
            <Box className="lesson-header-media">
              <Skeleton variant="rectangular" width="100%" height={400} style={{ borderRadius: 12 }} />
            </Box>
          </Box>
          <CardContent className="lesson-page-content">
            {/* Lesson content skeleton */}
            <Box sx={{ mt: 4 }}>
              {[...Array(4)].map((_, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Skeleton variant="text" width="40%" sx={{ mb: 1 }} />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="80%" />
                </Box>
              ))}
            </Box>
            <Box className="lesson-page-footer">
              <Skeleton variant="rectangular" width={120} height={40} />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="90%" />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default function LessonPage() {
  const { language, slug } = useParams();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_LESSON, {
    variables: { language, slug },
    skip: !language || !slug,
  });
  const [isColdStart, setIsColdStart] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setIsColdStart(true), COLD_START_TIMEOUT);
      return () => clearTimeout(timer);
    } else {
      setIsColdStart(false);
      return undefined;
    }
  }, [loading]);

  if (loading) {
    return isColdStart ? (
      <ColdStartMessage />
    ) : (
      <LessonSkeleton />
    );
  }
  if (error) {
    return <div className="article-error">Error loading article.</div>;
  }
  const lesson = data?.lessons?.[0];
  if (!lesson) {
    return <div className="article-not-found">Not Found</div>;
  }

  const imageUrl = lesson.main_image
    ? `${import.meta.env.VITE_API_BASE?.replace('/graphql', '')}/assets/${
        lesson.main_image.id
      }`
    : 'https://via.placeholder.com/1200x400';

  return (
    <Box className="page-container lesson-page-container">
      <Container maxWidth="md">
        <Box className="lesson-page-back-button">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/lessons`)}
            variant="outlined"
          >
            Back to Lessons
          </Button>
        </Box>
        <Card className="lesson-page-card">
          <LessonHeader 
            title={lesson.title} 
            imageUrl={imageUrl} 
            language={language || ''} 
            series={lesson.Series}
          />
          <CardContent className="lesson-page-content">
            <LessonContent lesson={lesson} />
            <Box className="lesson-page-footer">
              {lesson.deck_link && (
                <Button
                  className="lesson-page-cta"
                  href={lesson.deck_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                >
                  Go to Deck
                </Button>
              )}
              <Typography component="p" className="lesson-page-disclaimer">
                Note: This lesson was created with the help of AI and reviewed
                for clarity and usefulness. While not written by a native
                speaker, it's designed as a helpful guide for beginners. For
                professional or academic use, we recommend supplementing with
                native-level resources.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}