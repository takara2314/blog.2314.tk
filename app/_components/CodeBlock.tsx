'use client';

import { JetBrains_Mono } from 'next/font/google';
import { CopyBlock, github } from 'react-code-blocks';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

interface Props {
  code: string;
  language: string;
}

export default function CodeBlock({
  code,
  language,
}: Props) {
  return (
    <div className={jetbrainsMono.className}>
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
