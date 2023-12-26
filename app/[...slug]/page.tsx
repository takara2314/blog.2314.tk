import useArticle from '../_hooks/useArticle';
import { fetchArticleInfos } from '../_lib/fetchArticles';

export default async function Page({
  params,
}: { params: { slug: string[] } }) {
  return useArticle(params.slug);
}

export async function generateStaticParams() {
  const articles = await fetchArticleInfos();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}
