import clsx from 'clsx';
import type { ReactElement } from 'react';
import CodeBlock from '../_components/CodeBlock';
import ExternalPicture from '../_components/ExternalPicture';
import { Block, Span } from '../_models/article';

export function parseReactElements(
  blocks: Block[],
): ReactElement[] {
  const elements = [];

  for (const block of blocks) {
    elements.push(parseReactElement(block));
  }

  return elements;
}

export function parseReactElement(
  block: Block,
): ReactElement {
  switch (block.type) {
    case 'paragraph':
      return (
        <p>{...parseReactSpanElements(block.spans)}</p>
      );

    case 'heading_1':
      return (
        <h1 className="my-5 text-2xl font-bold">
          {block.text}
        </h1>
      );

    case 'heading_2':
      return (
        <h2 className="my-5 text-2xl font-bold">
          {block.text}
        </h2>
      );

    case 'heading_3':
      return (
        <h3 className="my-5 text-xl font-bold">
          {block.text}
        </h3>
      );

    case 'image':
      return (
        <div className="my-5">
          <ExternalPicture
            src={block.src}
            alt={block.alt ?? undefined}
          />
        </div>
      );

    case 'unordered_list':
      return (
        <ul className="my-5 pl-8 list-disc">
          {block.items.map((item) => (
            <li key={item.id}>
              {'checked' in item && (
                <input
                  type="checkbox"
                  checked={item.checked}
                  readOnly
                />
              )}

              {...parseReactSpanElements(item.spans)}
            </li>
          ))}
        </ul>
      );

    case 'ordered_list':
      return (
        <ol className="my-5 pl-8 list-decimal">
          {block.items.map((item) => (
            <li key={item.id}>
              {...parseReactSpanElements(item.spans)}
            </li>
          ))}
        </ol>
      );

    case 'quote':
      return (
        <blockquote className="my-5 p-5 bg-gray-200">
          {...parseReactSpanElements(block.spans)}
        </blockquote>
      );

    case 'callout':
      return (
        <aside className="my-5 p-5 bg-gray-200">
          {...parseReactSpanElements(block.spans)}
        </aside>
      );

    case 'code':
      return (
        <CodeBlock
          code={block.code}
          language={block.language}
          className="my-5 border-2 border-gray-200"
        />
      );

    case 'horizontal_rule':
      return <hr className="my-5 h-1 bg-gray-200" />;

    default:
      return <></>;
  }
}

export function parseReactSpanElements(
  spans: Span[],
): ReactElement<HTMLSpanElement | HTMLAnchorElement>[] {
  return spans.map((span) => {
    const classNames = parseSpanClassNames(span);

    if (span.link) {
      if (!('underline' in classNames)) {
        classNames.push('underline');
      }

      return (
        <a
          className={
            classNames.length === 0
              ? undefined
              : clsx(classNames)
          }
          href={span.link}
        >
          {span.text}
        </a>
      );
    }

    return (
      <span
        className={
          classNames.length === 0
            ? undefined
            : clsx(classNames)
        }
      >
        {span.text}
      </span>
    );
  });
}

function parseSpanClassNames(span: Span): string[] {
  const classNames = [];

  if (span.style.bold) {
    classNames.push('font-bold');
  }

  if (span.style.italic) {
    classNames.push('italic');
  }

  if (span.style.strikethrough) {
    classNames.push('line-through');
  }

  if (span.style.underline) {
    classNames.push('underline');
  }

  if (span.style.code) {
    classNames.push('font-mono');
  }

  if (span.style.backgroundColor !== 'bg-none') {
    classNames.push(span.style.backgroundColor);
  }

  if (span.style.color !== 'text-black') {
    classNames.push(span.style.color);
  }

  return classNames;
}
