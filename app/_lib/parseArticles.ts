import type {
  BlockObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { cdate } from 'cdate';

import type {
  ArticleInfo,
  BackgroundColor,
  Block,
  Color,
  ColorWithBackgroundNotion,
  Heading1,
  Heading2,
  Heading3,
  Image,
  ListItem,
  Paragraph,
  Span,
  SpanNotion,
  Style,
} from '../_models/article';

export function parseArticleInfo(
  page: PageObjectResponse,
): ArticleInfo {
  return {
    id: page.id,
    title:
      // @ts-ignore
      page.properties.Title.title[0].plain_text ?? '',
    slug:
      // @ts-ignore
      page.properties.Slug.rich_text[0].plain_text ?? '',
    description:
      // @ts-ignore
      page.properties.Description.rich_text[0].plain_text ??
      '',
    tags:
      //@ts-ignore
      page.properties.Tags.multi_select.map(
        (tag: {
          id: string;
          name: string;
          color: string;
        }) => tag.name,
      ) ?? [],
    publishedAt:
      // @ts-ignore
      cdate(page.properties.PublishedAt.date.start),
    updatedAt:
      // @ts-ignore
      cdate(page.properties.UpdatedAt.last_edited_time),
    published:
      // @ts-ignore
      page.properties.Published.checkbox ?? false,
  };
}

export function parseBlocks(
  blocksUnparsed: (
    | PartialBlockObjectResponse
    | BlockObjectResponse
  )[],
): Block[] {
  const blocks: Block[] = [];

  let prevBlockIsUnorderedList = false;
  let unorderedList: ListItem[] = [];
  let prevBlockIsOrderedList = false;
  let orderedList: ListItem[] = [];

  for (const block of blocksUnparsed) {
    // @ts-ignore
    const blockType: string = block.type;

    if (blockType === 'bulleted_list_item') {
      unorderedList.push(parseBlock(block) as ListItem);
      prevBlockIsUnorderedList = true;
      continue;
    }

    if (prevBlockIsUnorderedList) {
      blocks.push({
        type: 'unordered_list',
        items: unorderedList,
      });
      unorderedList = [];
      prevBlockIsUnorderedList = false;
    }

    if (blockType === 'numbered_list_item') {
      orderedList.push(parseBlock(block) as ListItem);
      prevBlockIsOrderedList = true;
      continue;
    }

    if (prevBlockIsOrderedList) {
      blocks.push({
        type: 'ordered_list',
        items: orderedList,
      });
      orderedList = [];
      prevBlockIsOrderedList = false;
    }

    blocks.push(parseBlock(block));
  }

  return blocks;
}

export function parseBlock(
  block: PartialBlockObjectResponse | BlockObjectResponse,
): Block {
  // @ts-ignore
  switch (block.type) {
    case 'paragraph':
      return parseParagraph(block);
    case 'heading_1':
      return parseHeading1(block);
    case 'heading_2':
      return parseHeading2(block);
    case 'heading_3':
      return parseHeading3(block);
    case 'image':
      return parseImage(block);
    case 'bulleted_list_item':
      return parseUnorderedListItem(block);
    case 'numbered_list_item':
      return parseOrderedListItem(block);
    // case 'quote':
    // 	break;
    // case 'to_do':
    // 	break;
    // case 'toggle':
    //   break;
    // case 'child_page':
    //   break;
    // case 'unsupported':
    //   break;
    default:
      // // @ts-ignore
      // console.log(block.type);
      return {
        type: 'paragraph',
        spans: [],
      };
  }
}

function parseColor(
  colorWithBackground: ColorWithBackgroundNotion,
): Color {
  const items = colorWithBackground.split('_');

  if (items.length === 2) {
    return 'text-black';
  }

  switch (items[0]) {
    case 'gray':
      return 'text-gray-600';
    case 'brown':
      return 'text-brown-600';
    case 'orange':
      return 'text-orange-600';
    case 'yellow':
      return 'text-yellow-600';
    case 'green':
      return 'text-green-600';
    case 'blue':
      return 'text-blue-600';
    case 'purple':
      return 'text-purple-600';
    case 'pink':
      return 'text-pink-600';
    case 'red':
      return 'text-red-600';
    default:
      return 'text-black';
  }
}

function parseBackgroundColor(
  colorWithBackground: ColorWithBackgroundNotion,
): BackgroundColor {
  const items = colorWithBackground.split('_');

  if (items.length === 1) {
    return 'bg-none';
  }

  switch (items[0]) {
    case 'gray':
      return 'bg-gray-200';
    case 'brown':
      return 'bg-brown-200';
    case 'orange':
      return 'bg-orange-200';
    case 'yellow':
      return 'bg-yellow-200';
    case 'green':
      return 'bg-green-200';
    case 'blue':
      return 'bg-blue-200';
    case 'purple':
      return 'bg-purple-200';
    case 'pink':
      return 'bg-pink-200';
    case 'red':
      return 'bg-red-200';
    default:
      return 'bg-none';
  }
}

function parseSpan(spanNotion: SpanNotion): Span {
  const annotation = spanNotion.annotations;

  const style: Style = {
    bold: annotation.bold,
    italic: annotation.italic,
    strikethrough: annotation.strikethrough,
    underline: annotation.underline,
    code: annotation.code,
    color: parseColor(
      annotation.color as ColorWithBackgroundNotion,
    ),
    backgroundColor: parseBackgroundColor(
      annotation.color as ColorWithBackgroundNotion,
    ),
  };

  return {
    text: spanNotion.plain_text,
    link: spanNotion.href,
    style,
  };
}

function parseParagraph(
  block: PartialBlockObjectResponse | BlockObjectResponse,
): Paragraph {
  const spans = [];

  // @ts-ignore
  for (const span of block.paragraph.rich_text) {
    spans.push(parseSpan(span as SpanNotion));
  }

  return {
    type: 'paragraph',
    spans,
  };
}

function parseHeading1(
  block: PartialBlockObjectResponse | BlockObjectResponse,
): Heading1 {
  const texts: string[] = [];

  // @ts-ignore
  for (const text of block.heading_1.rich_text) {
    texts.push(text.plain_text);
  }

  return {
    type: 'heading_1',
    text: texts.join(''),
  };
}

function parseHeading2(
  block: PartialBlockObjectResponse | BlockObjectResponse,
): Heading2 {
  const texts: string[] = [];

  // @ts-ignore
  for (const text of block.heading_2.rich_text) {
    texts.push(text.plain_text);
  }

  return {
    type: 'heading_2',
    text: texts.join(''),
  };
}

function parseHeading3(
  block: PartialBlockObjectResponse | BlockObjectResponse,
): Heading3 {
  const texts: string[] = [];

  // @ts-ignore
  for (const text of block.heading_3.rich_text) {
    texts.push(text.plain_text);
  }

  return {
    type: 'heading_3',
    text: texts.join(''),
  };
}

function parseImage(
  block: PartialBlockObjectResponse | BlockObjectResponse,
): Image {
  return {
    type: 'image',
    // @ts-ignore
    src: block.image.file.url,
  };
}

function parseListItem(
  block: PartialBlockObjectResponse | BlockObjectResponse,
  blockType: string,
): ListItem {
  const spans = [];

  // @ts-ignore
  for (const span of block[blockType].rich_text) {
    spans.push(parseSpan(span as SpanNotion));
  }

  return {
    type: 'list_item',
    spans,
  };
}

function parseUnorderedListItem(
  block: PartialBlockObjectResponse | BlockObjectResponse,
): ListItem {
  return parseListItem(block, 'bulleted_list_item');
}

function parseOrderedListItem(
  block: PartialBlockObjectResponse | BlockObjectResponse,
): ListItem {
  return parseListItem(block, 'numbered_list_item');
}
