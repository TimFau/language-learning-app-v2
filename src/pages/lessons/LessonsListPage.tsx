import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import 'css/pages/lesson.scss';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from '@mui/material';

const GET_LESSONS = gql`
  query GetLessons {
    lessons {
      title
      slug
      language
      lesson_number
    }
  }
`;

export default function LessonsListPage() {
  const { loading, error, data } = useQuery(GET_LESSONS);

  if (loading) {
    return <div className="lessons-loading">Loading...</div>;
  }
  if (error) {
    return <div className="lessons-error">Error loading lessons.</div>;
  }
  const lessons = data?.lessons || [];

  return (
    <div className="lessons-list-page">
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom className="lessons-list-title">
          Lessons
        </Typography>
        {lessons.length === 0 ? (
          <div className="lessons-empty">No lessons available yet.</div>
        ) : (
          <Grid container spacing={4}>
            {lessons.map((lesson: any) => (
              <Grid key={lesson.slug} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card className="lesson-card">
                  <CardActionArea
                    component={Link}
                    to={`${lesson.language}/${lesson.slug}`}
                    className="lesson-card-action-area"
                  >
                    <CardMedia
                      className="lesson-card-media"
                      image="https://via.placeholder.com/345x140"
                      title={lesson.title}
                    />
                    <CardContent className="lesson-card-content">
                      <Typography gutterBottom variant="h5" component="h2">
                        {lesson.title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
} 