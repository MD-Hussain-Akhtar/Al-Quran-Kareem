import React, { useState } from 'react';
import { getTajweedClassStyles } from '../services/quranApi';

interface TajweedParserProps {
  rawTajweedHtml?: string;
  fallbackArabicText: string;
  enableTajweedColors: boolean;
  fontSize: number;
}

export const TajweedParser: React.FC<TajweedParserProps> = ({
  rawTajweedHtml,
  fallbackArabicText,
  enableTajweedColors,
  fontSize
}) => {
  const [activeRuleHint, setActiveRuleHint] = useState<string | null>(null);

  if (!enableTajweedColors || !rawTajweedHtml) {
    return (
      <span
        className="font-arabic leading-loose tracking-wide select-text block text-right text-stone-900 dark:text-stone-100"
        style={{ fontSize: `${fontSize}px`, direction: 'rtl' }}
      >
        {fallbackArabicText}
      </span>
    );
  }

  // Parse HTML string containing <tajweed class="...">...</tajweed>
  const tokens = parseTajweedMarkup(rawTajweedHtml);

  return (
    <div className="relative">
      <div
        className="font-arabic leading-loose tracking-wide select-text text-right text-stone-900 dark:text-stone-100 transition-all duration-150"
        style={{ fontSize: `${fontSize}px`, direction: 'rtl' }}
      >
        {tokens.map((token, index) => {
          if (!token.isTajweed || !token.tajweedClass) {
            return <span key={index}>{token.text}</span>;
          }

          const styleMeta = getTajweedClassStyles(token.tajweedClass);

          return (
            <span
              key={index}
              onClick={() => setActiveRuleHint(activeRuleHint === styleMeta.label ? null : styleMeta.label)}
              onMouseEnter={() => setActiveRuleHint(styleMeta.label)}
              onMouseLeave={() => setActiveRuleHint(null)}
              className={`inline transition-colors duration-150 cursor-pointer underline decoration-dotted decoration-stone-300 dark:decoration-stone-700 underline-offset-4 hover:opacity-90 ${styleMeta.color}`}
              title={styleMeta.label}
            >
              {token.text}
            </span>
          );
        })}
      </div>

      {activeRuleHint && (
        <div className="mt-2 flex items-center justify-end">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans-ui bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 rounded shadow-md pointer-events-none transition-opacity">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{activeRuleHint}</span>
          </div>
        </div>
      )}
    </div>
  );
};

interface ParsedToken {
  text: string;
  isTajweed: boolean;
  tajweedClass?: string;
}

function parseTajweedMarkup(html: string): ParsedToken[] {
  const result: ParsedToken[] = [];
  // Regular expression to match <tajweed class="...">...</tajweed> or plain text
  const tagRegex = /<tajweed\s+class=["']?([^"'>]+)["']?>([\s\S]*?)<\/tajweed>/gi;

  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(html)) !== null) {
    if (match.index > lastIdx) {
      const textBefore = html.substring(lastIdx, match.index);
      if (textBefore) {
        result.push({ text: cleanEntities(textBefore), isTajweed: false });
      }
    }

    const cssClass = match[1];
    const innerText = match[2];
    result.push({
      text: cleanEntities(innerText),
      isTajweed: true,
      tajweedClass: cssClass
    });

    lastIdx = tagRegex.lastIndex;
  }

  if (lastIdx < html.length) {
    const trailing = html.substring(lastIdx);
    if (trailing) {
      result.push({ text: cleanEntities(trailing), isTajweed: false });
    }
  }

  return result.length > 0 ? result : [{ text: cleanEntities(html), isTajweed: false }];
}

function cleanEntities(str: string): string {
  return str
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"');
}
