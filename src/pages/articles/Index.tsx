import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import 'css/pages/article.scss';

const GET_ARTICLES = gql`
  query GetArticles {
    articles {
      title
      slug
      language
      lesson_number
    }
  }
`;

export default function ArticlesListPage() {
  const { loading, error, data } = useQuery(GET_ARTICLES);

  if (loading) {
    return <div className="articles-loading">Loading...</div>;
  }
  if (error) {
    return <div className="articles-error">Error loading articles.</div>;
  }
  const articles = data?.articles || [];

  return (
    <div className="articles-list-page-container">
      <h1 className="articles-list-title">Articles</h1>
      {articles.length === 0 ? (
        <div className="articles-empty">No articles available yet.</div>
      ) : (
        <ul className="articles-list">
          {articles.map((article: any) => (
            <li key={article.slug} className="articles-list-item">
              <Link to={`${article.language}/${article.slug}`} className="articles-list-link">
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 