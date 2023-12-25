import {
  fetchArticleBySlug,
  fetchArticleInfos,
} from '../_lib/fetchArticles';

export default async function Page({
  params,
}: { params: { slug: string[] } }) {
  const article = await fetchArticleBySlug(params.slug);

  if (!article) {
    return <div>404 Not Found</div>;
  }

  return (
    <main>
      <h1 className="text-2xl font-bold text-yellow-600">
        {article.title}
      </h1>

      {article.blocks.map((block) => (
        <div>ここにブロックを表示する</div>
      ))}
    </main>
  );
}

export async function generateStaticParams() {
  const articles = await fetchArticleInfos();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}
