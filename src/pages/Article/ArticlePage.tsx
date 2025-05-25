import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'css/pages/article.scss';

const GET_ARTICLE = gql`
  query GetArticle($language: String!, $slug: String!) {
    articles(filter: { language: { _eq: $language }, slug: { _eq: $slug } }) {
      title
      slug
      language
      body
      deck_link
      lesson_number
    }
  }
`;

export default function ArticlePage() {
  const { language, slug } = useParams();
  const { loading, error, data } = useQuery(GET_ARTICLE, {
    variables: { language, slug },
    skip: !language || !slug,
  });

  if (loading) {
    return <div className="article-loading">Loading...</div>;
  }
  if (error) {
    return <div className="article-error">Error loading article.</div>;
  }
  const article = data?.articles?.[0];
  if (!article) {
    return <div className="article-not-found">Not Found</div>;
  }
  return (
    <div className="article-page-container">
      <h1 className="article-title">{article.title}</h1>
      <div className="article-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body}</ReactMarkdown>
      </div>
      {article.deck_link && (
        <a className="article-cta-link" href={article.deck_link} target="_blank" rel="noopener noreferrer">
          Go to Deck
        </a>
      )}
    </div>
  );
} 