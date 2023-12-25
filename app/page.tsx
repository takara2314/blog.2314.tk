import { fetchArticleInfos } from './_lib/fetchArticles';

export default async function Home() {
  const articles = await fetchArticleInfos();

  return (
    <main>
      <h1 className="mb-1 text-2xl font-bold text-green-600">
        タカラーンブログ
      </h1>
      <div>Coming soon...</div>

      <ul>
        {articles.map((article) => (
          <li key={article.title}>
            <a href={`/${article.slug}`}>{article.title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
