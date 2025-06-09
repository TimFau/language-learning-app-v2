import { gql, useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'css/pages/lesson.scss';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Typography,
  Skeleton,
} from '@mui/material';
import { LESSON_CORE_FIELDS } from '../../services/graphql/fragments/lessonFragments';
import ColdStartMessage from '../../components/ColdStartMessage';
import { COLD_START_TIMEOUT } from '../../utils/constants';

const GET_LESSONS = gql`
  query GetLessons {
    lessons {
      ...LessonCoreFields
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
  lesson_series?: {
    id: string;
    title: string;
    slug: string;
    description: string;
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
        <CardActionArea className="lesson-card-action-area">
          <Skeleton 
            variant="rectangular" 
            className="lesson-card-media"
            height={140}
          />
          <CardContent className="lesson-card-content">
            <Skeleton variant="text" width={60} />
            <Skeleton variant="text" height={32} style={{ marginBottom: 8 }} />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="80%" />
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}

export default function LessonsListPage() {
  const { loading, error, data } = useQuery(GET_LESSONS);
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
      <div className="page-container lessons-list-page">
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" gutterBottom className="lessons-list-title">
            <Skeleton width={200} />
          </Typography>
          <div className="series-group">
            <Typography variant="h5" component="h2" gutterBottom className="series-title">
              <Skeleton width={150} />
            </Typography>
            <div className="lessons-grid">
              {[...Array(6)].map((_, index) => (
                <LessonCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }
  if (error) {
    return <div className="lessons-error">Error loading lessons.</div>;
  }
  const lessons: Lesson[] = data?.lessons || [];

  const lessonsBySeries: { [key: string]: Lesson[] } = lessons.reduce(
    (acc, lesson) => {
      const seriesTitle = lesson.lesson_series?.title || 'Uncategorized';
      if (!acc[seriesTitle]) {
        acc[seriesTitle] = [];
      }
      acc[seriesTitle].push(lesson);
      return acc;
    },
    {} as { [key: string]: Lesson[] }
  );

  return (
    <div className="page-container lessons-list-page">
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom className="lessons-list-title">
          Lessons
        </Typography>
        {lessons.length === 0 ? (
          <div className="lessons-empty">No lessons available yet.</div>
        ) : (
          Object.entries(lessonsBySeries).map(([seriesName, lessons]) => (
            <div key={seriesName} className="series-group">
              <Typography variant="h5" component="h2" gutterBottom className="series-title">
                {seriesName}
              </Typography>
              <div className="lessons-grid">
                {lessons.map((lesson: Lesson) => (
                  <div key={lesson.slug} className="lesson-grid-item">
                    <Card className="lesson-card">
                      <CardActionArea
                        component={Link}
                        to={`${lesson.language}/${lesson.slug}`}
                        className="lesson-card-action-area"
                      >
                        <CardMedia
                          component="img"
                          className="lesson-card-media"
                          image={
                            lesson.main_image?.id
                              ? `${import.meta.env.VITE_API_BASE?.replace(
                                  '/graphql',
                                  ''
                                )}/assets/${lesson.main_image.id}`
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
            </div>
          ))
        )}
      </Container>
    </div>
  );
} 