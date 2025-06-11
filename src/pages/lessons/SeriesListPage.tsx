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
import Breadcrumbs, { BreadcrumbItem } from '../../components/Breadcrumbs';
import { getFileExtension } from '../../utils/fileUtils';

const LANGUAGE_CODE_MAP: { [key: string]: string } = {
  'es': 'spanish',
  'fr': 'french',
  'de': 'german'
};

const GET_LANGUAGE_SERIES = gql`
  query GetLanguageSeries($language: String!) {
    lesson_series(filter: { language: { _eq: $language } }) {
      id
      title
      slug
      description
      short_description
      image {
        id
        filename_download
      }
    }
  }
`;

interface Series {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  image?: {
    id: string;
    filename_download: string;
  };
}

function SeriesCardSkeleton() {
  return (
    <div className="lesson-grid-item">
      <Card className="lesson-card">
        <CardActionArea>
          <Skeleton variant="rectangular" height={140} />
          <CardContent>
            <Skeleton variant="text" height={32} />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="80%" />
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}

export default function SeriesListPage() {
  const { language } = useParams<{ language: string }>();
  const fullLanguageName = language ? LANGUAGE_CODE_MAP[language] : undefined;
  
  const { loading, error, data } = useQuery(GET_LANGUAGE_SERIES, {
    variables: { language: fullLanguageName },
    skip: !fullLanguageName
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

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Lessons', href: '/lessons' },
    { label: LANGUAGE_CODE_MAP[language]?.charAt(0).toUpperCase() + LANGUAGE_CODE_MAP[language]?.slice(1) || '' },
  ];

  if (loading) {
    return isColdStart ? (
      <ColdStartMessage />
    ) : (
      <div className="page-container series-list-page">
        <Container maxWidth="lg">
          <Breadcrumbs items={breadcrumbs} />
          <Typography variant="h4" component="h1" gutterBottom>
            <Skeleton width={200} />
          </Typography>
          <div className="series-grid lessons-grid">
            {[...Array(4)].map((_, index) => (
              <SeriesCardSkeleton key={index} />
            ))}
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return <div className="lessons-error">Error loading lesson series.</div>;
  }

  const series: Series[] = data?.lesson_series || [];

  return (
    <div className="page-container series-list-page">
      <Container maxWidth="lg">
        <Breadcrumbs items={breadcrumbs} />
        <Typography variant="h4" component="h1" gutterBottom className="lessons-list-title">
          Available Series
        </Typography>
        {series.length === 0 ? (
          <div className="lessons-empty">No series available for this language yet.</div>
        ) : (
          <div className="series-grid lessons-grid">
            {series.map((series) => (
              <div key={series.id} className="lesson-grid-item">
                <Card className="lesson-card">
                  <CardActionArea
                    component={Link}
                    to={`/lessons/${language}/${series.slug}`}
                    className="lesson-card-action-area"
                  >
                    <CardMedia
                      component="img"
                      className="lesson-card-media"
                      image={
                        series.image?.id
                          ? `${import.meta.env.VITE_MEDIA_BASE}/${series.image.id}.${getFileExtension(series.image.filename_download)}`
                          : 'https://via.placeholder.com/345x140'
                      }
                      alt={series.title}
                    />
                    <CardContent className="lesson-card-content">
                      <Typography gutterBottom variant="h5" component="h2">
                        {series.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {series.short_description || series.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
} 