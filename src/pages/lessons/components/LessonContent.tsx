import { Box, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Callout from './Callout';
import VocabTable from './VocabTable';

// Language code normalization map
const LANGUAGE_CODE_MAP: { [key: string]: 'spanish' | 'french' | 'german' } = {
  es: 'spanish',
  fr: 'french',
  de: 'german',
  spanish: 'spanish',
  french: 'french',
  german: 'german',
  Spanish: 'spanish',
  French: 'french',
  German: 'german',
};

// Normalize language code to the format expected by VocabTable
const normalizeLanguage = (language: string): 'spanish' | 'french' | 'german' => {
  const normalized = LANGUAGE_CODE_MAP[language];
  if (!normalized) {
    console.warn(`Unknown language code: ${language}, defaulting to spanish`);
    return 'spanish';
  }
  return normalized;
};

export default function LessonContent({ lesson }: { lesson: any }) {
  if (lesson.lesson_content?.sections) {
    try {
      // NOTE: Directus JSON fields can be returned as strings
      const sections =
        typeof lesson.lesson_content.sections === 'string'
          ? JSON.parse(lesson.lesson_content.sections)
          : lesson.lesson_content.sections;

      if (!Array.isArray(sections)) {
        console.error('Parsed sections are not an array:', sections);
        throw new Error('Lesson content is not in the expected format.');
      }

      return (
        <Box className="lesson-page-body">
          {lesson.lesson_content?.description && (
            <Typography component="p" className="lesson-page-description">
              {lesson.lesson_content.description}
            </Typography>
          )}
          {sections.map((section: any, index: number) => {
            switch (section.type) {
              case 'vocab_table':
                return <VocabTable key={index} section={section} language={normalizeLanguage(lesson.language)} />;
              case 'callout':
                return <Callout key={index} section={section} deckLink={lesson.deck_link} />;
              default:
                return (
                  <div key={index}>Unknown section type: {section.type}</div>
                );
            }
          })}
        </Box>
      );
    } catch (error) {
      console.error('Failed to parse lesson content sections:', error);
      return (
        <div className="article-error">Error loading lesson content.</div>
      );
    }
  }

  if (lesson.body) {
    return (
      <Box className="lesson-page-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {lesson.body}
        </ReactMarkdown>
      </Box>
    );
  }

  return <div className="article-not-found">No lesson content available.</div>;
} 