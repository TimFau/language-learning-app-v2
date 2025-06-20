import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import 'css/pages/lesson.scss';
import 'css/pages/lessons.scss';
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
import Breadcrumbs, { BreadcrumbItem } from '../../components/Breadcrumbs';
import { getFileExtension } from '../../utils/fileUtils';

const LANGUAGE_CODE_MAP: { [key: string]: string } = {
  'es': 'spanish',
  'fr': 'french',
  'de': 'german'
};

const GET_LESSON = gql`
  query GetLesson($language: String!, $series: String!, $slug: String!) {
    lessons(filter: { 
      language: { _eq: $language },
      lesson_series: { slug: { _eq: $series } },
      slug: { _eq: $slug } 
    }) {
      ...LessonCoreFields
      body
      deck_link
      lesson_content
    }
  }
  ${LESSON_CORE_FIELDS}
`;

function LessonSkeleton({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) {
  return (
    <Box className="page-container lesson-page-container">
      <Container maxWidth="md">
        <Breadcrumbs items={breadcrumbs} />
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
  const { language, series, slug } = useParams();
  const navigate = useNavigate();
  const fullLanguageName = language ? LANGUAGE_CODE_MAP[language] : undefined;

  const { loading, error, data } = useQuery(GET_LESSON, {
    variables: { language: fullLanguageName, series, slug },
    skip: !fullLanguageName || !series || !slug,
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

  // Validate language code
  const validLanguages = Object.keys(LANGUAGE_CODE_MAP);
  if (!language || !validLanguages.includes(language)) {
    return <Navigate to="/lessons" replace />;
  }

  if (loading) {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' },
      { label: 'Lessons', href: '/lessons' },
      { label: LANGUAGE_CODE_MAP[language]?.charAt(0).toUpperCase() + LANGUAGE_CODE_MAP[language]?.slice(1) || '', href: `/lessons/${language}` },
      { label: series || '' },
    ];

    return isColdStart ? (
      <ColdStartMessage />
    ) : (
      <LessonSkeleton breadcrumbs={breadcrumbs} />
    );
  }
  if (error) {
    return <div className="article-error">Error loading article.</div>;
  }
  const lesson = data?.lessons?.[0];
  if (!lesson) {
    return <div className="article-not-found">Not Found</div>;
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Lessons', href: '/lessons' },
    { label: LANGUAGE_CODE_MAP[language]?.charAt(0).toUpperCase() + LANGUAGE_CODE_MAP[language]?.slice(1) || '', href: `/lessons/${language}` },
    { label: lesson.lesson_series?.title || 'Untitled Series', href: `/lessons/${language}/${series}` },
    { label: lesson.title || 'Untitled Lesson' },
  ];

  return (
    <Box className="page-container lesson-page-container">
      <Container maxWidth="md">
        <Breadcrumbs items={breadcrumbs} />
        <Card className="lesson-page-card">
          <LessonHeader 
            title={lesson.title} 
            imageUrl={lesson.main_image?.filename_download 
              ? `${import.meta.env.VITE_MEDIA_BASE || ''}/${lesson.main_image.id}.${getFileExtension(lesson.main_image.filename_download)}` 
              : 'https://via.placeholder.com/1200x400'} 
            language={LANGUAGE_CODE_MAP[language] || ''} 
            lessonSeries={lesson.lesson_series || { 
              id: 'default',
              title: 'Untitled Series', 
              slug: '', 
              description: 'No description available'
            }}
          />
          <CardContent className="lesson-page-content">
            <LessonContent lesson={lesson} />
            <Box className="lesson-page-footer">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(`/lessons/${language}/${series}`)}
                  variant="outlined"
                >
                  Back to Series
                </Button>
                {/* <Button
                  variant="contained"
                  color="primary"
                  // TODO: Add navigation to next lesson when available
                  onClick={() => {}}
                >
                  Next Lesson
                </Button> */}
              </Box>
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