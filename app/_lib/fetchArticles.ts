import { Client } from '@notionhq/client';
import type {
  BlockObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { ArticleInfo } from '../_models/article';
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

export async function fetchArticle(pageId: string) {
  const blocksUnparsed: (
    | PartialBlockObjectResponse
    | BlockObjectResponse
  )[] = [];
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

  // TODO: remove
  // console.log(JSON.stringify(blocksUnparsed, null, 2));
  console.log(JSON.stringify(blocks, null, 2));

  return blocks;
}
