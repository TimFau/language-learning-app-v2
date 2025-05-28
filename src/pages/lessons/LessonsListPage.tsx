import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import 'css/pages/lesson.scss';

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
    <div className="lessons-list-page-container">
      <h1 className="lessons-list-title">Lessons</h1>
      {lessons.length === 0 ? (
        <div className="lessons-empty">No lessons available yet.</div>
      ) : (
        <ul className="lessons-list">
          {lessons.map((lesson: any) => (
            <li key={lesson.slug} className="lessons-list-item">
              <Link to={`${lesson.language}/${lesson.slug}`} className="lessons-list-link">
                {lesson.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 