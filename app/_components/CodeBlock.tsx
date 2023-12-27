'use client';

import { CopyBlock, github } from 'react-code-blocks';

interface Props {
  code: string;
  language: string;
}

export default function CodeBlock({
  code,
  language,
}: Props) {
  return (
    <CopyBlock
      text={code}
      language={language}
      showLineNumbers={true}
      theme={github}
      codeBlock={true}
    />
  );
}
