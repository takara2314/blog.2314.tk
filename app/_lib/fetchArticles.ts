import { Client } from '@notionhq/client';
import type {
  BlockObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { cdate } from 'cdate';
import { Article, ArticleInfo } from '../_models/article';
import {
  parseArticleInfo,
  parseBlocks,
} from './parseArticles';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function fetchArticleInfos(): Promise<
  ArticleInfo[]
> {
  const articles: ArticleInfo[] = [];

  const res = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID ?? '',
    filter: {
      and: [
        {
          property: 'PublishedAt',
          date: {
            on_or_before: cdate().format(),
          },
        },
        {
          property: 'Published',
          checkbox: {
            equals: true,
          },
        },
      ],
    },
    sorts: [
      {
        property: 'PublishedAt',
        direction: 'descending',
      },
    ],
  });

  for (const page of res.results) {
    articles.push(
      parseArticleInfo(page as PageObjectResponse),
    );
  }

  return articles;
}

export async function fetchArticleInfo(
  pageId: string,
): Promise<ArticleInfo | null> {
  try {
    const page = await notion.pages.retrieve({
      page_id: pageId,
    });

    return parseArticleInfo(page);
  } catch (_) {
    return null;
  }
}

export async function getArticleIdBySlug(
  slug: string[],
): Promise<ArticleInfo | null> {
  const articles: ArticleInfo[] = [];

  const res = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID ?? '',
    filter: {
      and: [
        {
          property: 'Slug',
          rich_text: {
            equals: `/${slug.join('/')}`,
          },
        },
        {
          property: 'PublishedAt',
          date: {
            on_or_before: cdate().format(),
          },
        },
        {
          property: 'Published',
          checkbox: {
            equals: true,
          },
        },
      ],
    },
    sorts: [
      {
        property: 'PublishedAt',
        direction: 'descending',
      },
    ],
  });

  for (const page of res.results) {
    articles.push(
      parseArticleInfo(page as PageObjectResponse),
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return articles[0];
}

export async function fetchArticleBySlug(
  slug: string[],
): Promise<Article | null> {
  const articleInfo = await getArticleIdBySlug(slug);
  if (!articleInfo) {
    return null;
  }

  return await fetchArticle(articleInfo.id);
}

export async function fetchArticle(
  pageId: string,
): Promise<Article> {
  const blocksUnparsed: (
    | PartialBlockObjectResponse
    | BlockObjectResponse
  )[] = [];

  const info = await fetchArticleInfo(pageId);
  if (!info) {
    throw new Error('Article not found');
  }

  let cursor;
  while (true) {
    const { results, next_cursor } =
      await notion.blocks.children.list({
        start_cursor: cursor,
        block_id: pageId,
      });

    blocksUnparsed.push(...results);

    if (!next_cursor) {
      break;
    }
    cursor = next_cursor;
  }

  const blocks = parseBlocks(blocksUnparsed);

  return {
    blocks,
    ...info,
  };
}
