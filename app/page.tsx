import { fetchArticleBySlug } from './_lib/fetchArticles';

export default async function Home() {
  const article = await fetchArticleBySlug('/test');

  return (
    <main>
      <h1 className="mb-1 text-2xl font-bold text-green-600">
        タカラーンブログ
      </h1>
      Coming soon...
    </main>
  );
}
