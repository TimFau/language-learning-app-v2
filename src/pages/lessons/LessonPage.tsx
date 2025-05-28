import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'css/pages/lesson.scss';

const GET_LESSON = gql`
  query GetLesson($language: String!, $slug: String!) {
    lessons(filter: { language: { _eq: $language }, slug: { _eq: $slug } }) {
      title
      slug
      language
      body
      deck_link
      lesson_number
    }
  }
`;

export default function LessonPage() {
  const { language, slug } = useParams();
  const { loading, error, data } = useQuery(GET_LESSON, {
    variables: { language, slug },
    skip: !language || !slug,
  });

  if (loading) {
    return <div className="article-loading">Loading...</div>;
  }
  if (error) {
    return <div className="article-error">Error loading article.</div>;
  }
  const lesson = data?.lessons?.[0];
  if (!lesson) {
    return <div className="article-not-found">Not Found</div>;
  }
  return (
    <div className="article-page-container">
      <h1 className="article-title">{lesson.title}</h1>
      <div className="article-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.body}</ReactMarkdown>
        <p className="article-disclaimer" style={{marginTop: '2em', color: '#888', fontSize: '0.95em'}}>
          Note: This lesson was created with the help of AI and reviewed for clarity and usefulness. While not written by a native speaker, it's designed as a helpful guide for beginners. For professional or academic use, we recommend supplementing with native-level resources.
        </p>
      </div>
      {lesson.deck_link && (
        <a className="article-cta-link" href={lesson.deck_link} target="_blank" rel="noopener noreferrer">
          Go to Deck
        </a>
      )}
    </div>
  );
} 