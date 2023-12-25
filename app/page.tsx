import {
  fetchArticle,
  fetchArticleInfos,
} from './_lib/fetchArticles';

export default async function Home() {
  const articles = await fetchArticleInfos();
  const page = await fetchArticle(articles[0].id);

  return (
    <main>
      <h1 className="mb-1 text-2xl font-bold text-green-600">
        タカラーンブログ
      </h1>
      Coming soon...
    </main>
  );
}
