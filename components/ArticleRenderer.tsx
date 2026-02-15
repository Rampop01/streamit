'use client';

import React from 'react';

interface ArticleRendererProps {
  body: string;
}

/** Processes inline markdown: **bold**, *italic*, `code`, [links](url) */
function formatInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Image: ![alt](url)
    const imgMatch = remaining.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      parts.push(
        <span key={key++} className="block my-4">
          <img
            src={imgMatch[2]}
            alt={imgMatch[1]}
            className="rounded-lg max-w-full h-auto mx-auto shadow-lg border border-white/10"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          {imgMatch[1] && (
            <span className="block text-center text-sm text-muted-foreground mt-2 italic">
              {imgMatch[1]}
            </span>
          )}
        </span>
      );
      remaining = remaining.slice(imgMatch[0].length);
      continue;
    }

    // Bold: **text**
    const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
    if (boldMatch) {
      parts.push(
        <strong key={key++} className="font-bold text-foreground">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Italic: *text*
    const italicMatch = remaining.match(/^\*(.+?)\*/);
    if (italicMatch) {
      parts.push(
        <em key={key++} className="italic text-foreground/90">
          {italicMatch[1]}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Inline code: `code`
    const codeMatch = remaining.match(/^`(.+?)`/);
    if (codeMatch) {
      parts.push(
        <code key={key++} className="bg-white/10 text-stacks-orange-light px-1.5 py-0.5 rounded text-sm font-mono">
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Link: [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      parts.push(
        <a
          key={key++}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-stacks-orange hover:text-stacks-orange-light underline underline-offset-2 transition-colors"
        >
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Plain text — consume until next special character or end
    const nextSpecial = remaining.slice(1).search(/[*`!\[]/);
    if (nextSpecial === -1) {
      parts.push(remaining);
      break;
    } else {
      parts.push(remaining.slice(0, nextSpecial + 1));
      remaining = remaining.slice(nextSpecial + 1);
    }
  }

  return parts;
}

export function ArticleRenderer({ body }: ArticleRendererProps) {
  const lines = body.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let elementKey = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Skip blank lines
    if (!line) {
      i++;
      continue;
    }

    // Horizontal rule: --- or ***
    if (/^[-*_]{3,}$/.test(line)) {
      elements.push(<hr key={elementKey++} className="border-t border-white/10 my-8" />);
      i++;
      continue;
    }

    // Heading: # to ######
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const headingStyles: Record<number, string> = {
        1: 'text-3xl font-bold text-foreground mb-6 mt-2',
        2: 'text-2xl font-bold text-foreground mt-8 mb-4',
        3: 'text-xl font-semibold text-foreground mt-6 mb-3',
        4: 'text-lg font-semibold text-foreground mt-5 mb-2',
        5: 'text-base font-semibold text-foreground mt-4 mb-2',
        6: 'text-sm font-semibold text-foreground uppercase tracking-wider mt-4 mb-2',
      };
      const cls = headingStyles[level];
      const content = formatInline(text);
      if (level === 1) elements.push(<h1 key={elementKey++} className={cls}>{content}</h1>);
      else if (level === 2) elements.push(<h2 key={elementKey++} className={cls}>{content}</h2>);
      else if (level === 3) elements.push(<h3 key={elementKey++} className={cls}>{content}</h3>);
      else if (level === 4) elements.push(<h4 key={elementKey++} className={cls}>{content}</h4>);
      else if (level === 5) elements.push(<h5 key={elementKey++} className={cls}>{content}</h5>);
      else elements.push(<h6 key={elementKey++} className={cls}>{content}</h6>);
      i++;
      continue;
    }

    // Blockquote: > text
    if (line.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ''));
        i++;
      }
      elements.push(
        <blockquote
          key={elementKey++}
          className="border-l-4 border-stacks-orange/50 pl-4 my-4 text-foreground/70 italic"
        >
          {quoteLines.map((ql, j) => (
            <p key={j} className="mb-1">{formatInline(ql)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    // Standalone image line: ![alt](url)
    const imgLineMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgLineMatch) {
      elements.push(
        <div key={elementKey++} className="my-6">
          <img
            src={imgLineMatch[2]}
            alt={imgLineMatch[1]}
            className="rounded-lg max-w-full h-auto mx-auto shadow-lg border border-white/10"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          {imgLineMatch[1] && (
            <p className="text-center text-sm text-muted-foreground mt-2 italic">
              {imgLineMatch[1]}
            </p>
          )}
        </div>
      );
      i++;
      continue;
    }

    // Unordered list: - item or * item
    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={elementKey++} className="space-y-2 mb-4 ml-1">
          {items.map((item, j) => (
            <li key={j} className="text-foreground/85 leading-relaxed flex items-start gap-2">
              <span className="text-stacks-orange mt-1.5 text-xs">&#9679;</span>
              <span>{formatInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list: 1. item
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={elementKey++} className="space-y-2 mb-4 ml-1">
          {items.map((item, j) => (
            <li key={j} className="text-foreground/85 leading-relaxed flex items-start gap-2">
              <span className="text-stacks-orange font-bold text-sm mt-0.5 min-w-[1.2rem]">
                {j + 1}.
              </span>
              <span>{formatInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Auto-detect plain-text headings:
    // Short standalone lines (< 60 chars), no sentence-ending punctuation,
    // surrounded by blank lines — treated as h2
    const prevBlank = i === 0 || !lines[i - 1]?.trim();
    const nextBlank = i >= lines.length - 1 || !lines[i + 1]?.trim();
    const isShort = line.length < 60;
    const noEndPunct =
      !line.endsWith('.') &&
      !line.endsWith(',') &&
      !line.endsWith(';') &&
      !line.endsWith(':');
    const notListLike =
      !/^\d+\.\s/.test(line) &&
      !/^[-—•*]\s/.test(line) &&
      !/^!\[/.test(line) &&
      !/^>/.test(line);

    if (isShort && noEndPunct && prevBlank && nextBlank && notListLike) {
      const cls = i === 0
        ? 'text-3xl font-bold text-foreground mb-6 mt-2'
        : 'text-2xl font-bold text-foreground mt-8 mb-4';
      const Tag = i === 0 ? 'h1' : 'h2';
      elements.push(
        <Tag key={elementKey++} className={cls}>
          {formatInline(line)}
        </Tag>
      );
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={elementKey++} className="text-foreground/85 leading-relaxed mb-4 text-base">
        {formatInline(line)}
      </p>
    );
    i++;
  }

  return <div className="article-content">{elements}</div>;
}
