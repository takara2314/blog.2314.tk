'use client';

import { CopyBlock, github } from 'react-code-blocks';

interface Props {
  code: string;
  language: string;
}

export type ActualProps = Props &
  Omit<
    React.HTMLAttributes<HTMLElement>,
    'code' | 'language'
  >;

export default function CodeBlock(props: ActualProps) {
  const { code, language, ...parentProps } = props;

  return (
    <div {...parentProps}>
      <CopyBlock
        text={code}
        language={language}
        showLineNumbers={true}
        theme={github}
        codeBlock={true}
      />
    </div>
  );
}
