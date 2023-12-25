import type { cdate } from 'cdate';

export interface ArticleInfo {
  id: string;
  title: string;
  slug: string[];
  description: string;
  tags: string[];
  publishedAt: cdate.CDate;
  updatedAt: cdate.CDate;
  published: boolean;
}

export interface Article extends ArticleInfo {
  blocks: Block[];
}

export type Block =
  | Paragraph
  | Heading1
  | Heading2
  | Heading3
  | Image
  | UnorderedList
  | OrderedList
  | ListItem
  | CheckboxListItem
  | Quote
  | Callout
  | HorizontalRule;

export interface Paragraph {
  type: 'paragraph';
  spans: Span[];
}

export interface Heading1 {
  type: 'heading_1';
  text: string;
}

export interface Heading2 {
  type: 'heading_2';
  text: string;
}

export interface Heading3 {
  type: 'heading_3';
  text: string;
}

export interface Image {
  type: 'image';
  src: string;
}

export interface UnorderedList {
  type: 'unordered_list';
  items: (ListItem | CheckboxListItem)[];
}

export interface OrderedList {
  type: 'ordered_list';
  items: ListItem[];
}

export interface ListItem {
  type: 'list_item';
  spans: Span[];
}

export interface CheckboxListItem {
  type: 'checkbox_list_item';
  spans: Span[];
  checked: boolean;
}

export interface Quote {
  type: 'quote';
  spans: Span[];
}
export interface Callout {
  type: 'callout';
  spans: Span[];
  icon: CalloutIcon;
  backgroundColor: BackgroundColor;
}

export type CalloutIcon =
  | CalloutIconEmoji
  | CalloutIconExternal
  | CalloutIconFile;

export interface CalloutIconEmoji {
  type: 'emoji';
  emoji: string;
}

export interface CalloutIconExternal {
  type: 'external';
  external: {
    url: string;
  };
}

export interface CalloutIconFile {
  type: 'file';
  file: {
    url: string;
  };
}

export interface HorizontalRule {
  type: 'horizontal_rule';
}

export interface SpanNotion {
  type: 'text';
  text: {
    content: string;
    link?: string;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href?: string;
}

export interface Span {
  text: string;
  link?: string;
  style: Style;
}

export type Color =
  | 'text-black'
  | 'text-gray-600'
  | 'text-brown-600'
  | 'text-orange-600'
  | 'text-yellow-600'
  | 'text-green-600'
  | 'text-blue-600'
  | 'text-purple-600'
  | 'text-pink-600'
  | 'text-red-600';

export type ColorNotion =
  | 'default'
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red';

export type BackgroundColor =
  | 'bg-none'
  | 'bg-gray-200'
  | 'bg-brown-200'
  | 'bg-orange-200'
  | 'bg-yellow-200'
  | 'bg-green-200'
  | 'bg-blue-200'
  | 'bg-purple-200'
  | 'bg-pink-200'
  | 'bg-red-200';

export type ColorWithBackgroundNotion =
  | `${ColorNotion}`
  | `${ColorNotion}_background`;

export interface Style {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  backgroundColor: BackgroundColor;
  color: Color;
}
