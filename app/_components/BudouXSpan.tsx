import type { HTMLProcessingParser } from 'budoux';

const loadDefaultJapaneseParser: () => HTMLProcessingParser =
  require('budoux/dist').loadDefaultJapaneseParser;

// U+200B ZERO WIDTH SPACE
const ZWSP_CODEPOINT = 0x200b;
const ZWSP = String.fromCharCode(ZWSP_CODEPOINT);

interface Props {
  children: React.ReactNode;
}

export type ActualProps = Props &
  Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>;

export default async function BudouXSpan(
  props: ActualProps,
) {
  const { children, ...parentProps } = props;

  const parser = loadDefaultJapaneseParser();

  if (typeof props.children !== 'string') {
    throw new Error(
      'BudouXSpan: children must be a string',
    );
  }

  const text = props.children as string;
  const chunks = parser.parse(text);

  return <span {...parentProps}>{chunks.join(ZWSP)}</span>;
}
