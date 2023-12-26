import type { ReactElement } from 'react';
import { Block } from '../_models/article';

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
        <p>
          {block.spans.map((span) => (
            <span>{span.text}</span>
          ))}
        </p>
      );

    case 'heading_1':
      return <h1>{block.text}</h1>;

    case 'heading_2':
      return <h2>{block.text}</h2>;

    case 'heading_3':
      return <h3>{block.text}</h3>;

    case 'image':
      return <img src={block.src} alt="" />;

    case 'unordered_list':
      return (
        <ul>
          {block.items.map((item) => (
            <li>
              {item.spans.map((span) => (
                <span>{span.text}</span>
              ))}
            </li>
          ))}
        </ul>
      );

    case 'ordered_list':
      return (
        <ol>
          {block.items.map((item) => (
            <li>
              {item.spans.map((span) => (
                <span>{span.text}</span>
              ))}
            </li>
          ))}
        </ol>
      );

    case 'quote':
      return (
        <blockquote>
          {block.spans.map((span) => (
            <span>{span.text}</span>
          ))}
        </blockquote>
      );

    case 'callout':
      return (
        <aside>
          {block.spans.map((span) => (
            <span>{span.text}</span>
          ))}
        </aside>
      );

    case 'horizontal_rule':
      return <hr />;

    default:
      return <></>;
  }
}
