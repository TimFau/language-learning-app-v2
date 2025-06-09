import { Link } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Typography,
} from '@mui/material';
import 'css/pages/lesson.scss';

interface Language {
  code: string;
  name: string;
  entryImage: string;
}

const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'es', name: 'Spanish', entryImage: '/images/language_entry/Spanish-Entry.png' },
  { code: 'fr', name: 'French', entryImage: '/images/language_entry/French-Entry.png' },
];

export default function LanguagesListPage() {
  return (
    <div className="page-container languages-list-page">
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom className="lessons-list-title">
          Choose a Language
        </Typography>
        <div className="languages-grid lessons-grid">
          {AVAILABLE_LANGUAGES.map((language) => (
            <div key={language.code} className="lesson-grid-item">
              <Card className="lesson-card">
                <CardActionArea
                  component={Link}
                  to={`/lessons/${language.code}`}
                  className="lesson-card-action-area"
                >
                  <CardMedia
                    component="img"
                    className="lesson-card-media"
                    image={language.entryImage}
                    alt={`${language.name} flag`}
                    sx={{ objectFit: 'contain', padding: 2 }}
                  />
                  <CardContent className="lesson-card-content">
                    <Typography gutterBottom variant="h5" component="h2" align="center">
                      {language.name}
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