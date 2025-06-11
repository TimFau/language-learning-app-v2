import { gql, useQuery } from '@apollo/client';
import { Link, useParams, Navigate } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Typography,
  Skeleton,
} from '@mui/material';
import 'css/pages/lesson.scss';
import ColdStartMessage from '../../components/ColdStartMessage';
import { COLD_START_TIMEOUT } from '../../utils/constants';
import { useState, useEffect } from 'react';
import { LESSON_CORE_FIELDS } from '../../services/graphql/fragments/lessonFragments';
import Breadcrumbs, { BreadcrumbItem } from '../../components/Breadcrumbs';

const LANGUAGE_CODE_MAP: { [key: string]: string } = {
  'es': 'spanish',
  'fr': 'french',
  'de': 'german',
};

const GET_SERIES_LESSONS = gql`
  query GetSeriesLessons($language: String!, $seriesSlug: String!) {
    lessons(filter: { 
      language: { _eq: $language },
      lesson_series: { slug: { _eq: $seriesSlug } }
    }) {
      ...LessonCoreFields
      lesson_series {
        id
        title
        description
        full_description
        image {
          id
          filename_download
        }
      }
    }
  }
  ${LESSON_CORE_FIELDS}
`;

interface Lesson {
  title: string;
  slug: string;
  language: string;
  lesson_number: number;
  main_image: {
    id: string;
  };
  short_description: string;
  lesson_series: {
    id: string;
    title: string;
    description: string;
    full_description: string;
    image?: {
      id: string;
      filename_download: string;
    };
  };
}

function LessonCardSkeleton() {
  return (
    <div className="lesson-grid-item">
      <Card className="lesson-card">
        <CardActionArea>
          <Skeleton variant="rectangular" height={140} />
          <CardContent>
            <Skeleton variant="text" width={60} />
            <Skeleton variant="text" height={32} />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="80%" />
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}

export default function SeriesLessonsPage() {
  const { language, series: seriesSlug } = useParams<{ language: string; series: string }>();
  const fullLanguageName = language ? LANGUAGE_CODE_MAP[language] : undefined;

  const { loading, error, data } = useQuery(GET_SERIES_LESSONS, {
    variables: { language: fullLanguageName, seriesSlug },
    skip: !fullLanguageName || !seriesSlug
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
      { label: 'Loading...' },
    ];

    return isColdStart ? (
      <ColdStartMessage />
    ) : (
      <div className="page-container series-lessons-page">
        <Container maxWidth="lg">
          <Breadcrumbs items={breadcrumbs} />
          <Typography variant="h4" component="h1" gutterBottom>
            <Skeleton width={200} />
          </Typography>
          <Typography variant="body1" paragraph>
            <Skeleton />
            <Skeleton width="80%" />
          </Typography>
          <div className="lessons-grid">
            {[...Array(6)].map((_, index) => (
              <LessonCardSkeleton key={index} />
            ))}
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return <div className="lessons-error">Error loading lessons.</div>;
  }

  const lessons: Lesson[] = data?.lessons || [];
  if (lessons.length === 0) {
    return <Navigate to={`/lessons/${language}`} replace />;
  }

  // Get series info from the first lesson (all lessons in the query will be from the same series)
  const series = lessons[0].lesson_series;
  const sortedLessons = [...lessons].sort((a, b) => a.lesson_number - b.lesson_number);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Lessons', href: '/lessons' },
    { label: LANGUAGE_CODE_MAP[language]?.charAt(0).toUpperCase() + LANGUAGE_CODE_MAP[language]?.slice(1) || '', href: `/lessons/${language}` },
    { label: series.title },
  ];

  return (
    <div className="page-container series-lessons-page">
      <Container maxWidth="lg">
        <Breadcrumbs items={breadcrumbs} />
        <Typography variant="h4" component="h1" gutterBottom className="lessons-list-title">
          {series.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {series.full_description || series.description}
        </Typography>
        <div className="lessons-grid">
          {sortedLessons.map((lesson) => (
            <div key={lesson.slug} className="lesson-grid-item">
              <Card className="lesson-card">
                <CardActionArea
                  component={Link}
                  to={`/lessons/${language}/${seriesSlug}/${lesson.slug}`}
                  className="lesson-card-action-area"
                >
                  <CardMedia
                    component="img"
                    className="lesson-card-media"
                    image={
                      lesson.main_image?.id
                        ? `${import.meta.env.VITE_MEDIA_BASE}/${lesson.main_image.id}.png`
                        : 'https://via.placeholder.com/345x140'
                    }
                    alt={lesson.title}
                  />
                  <CardContent className="lesson-card-content">
                    <Typography variant="caption" display="block" color="text.secondary">
                      Lesson {lesson.lesson_number}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="h2">
                      {lesson.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {lesson.short_description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
} 