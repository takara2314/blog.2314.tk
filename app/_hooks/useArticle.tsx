import { fetchArticleBySlug } from '../_lib/fetchArticles';
import { parseReactElements } from '../_lib/parseReactElements';

export default async function useArticle(slug: string[]) {
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    return <div>404 Not Found</div>;
  }

  const elements = parseReactElements(article.blocks);

  return (
    <main>
      <h1 className="text-2xl font-bold text-yellow-600">
        {article.title}
      </h1>

      {...elements}
    </main>
  );
}
