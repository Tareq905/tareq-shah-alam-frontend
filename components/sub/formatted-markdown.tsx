"use client";

import React, { useState } from "react";

interface FormattedMarkdownProps {
  content: string;
}

export const FormattedMarkdown: React.FC<FormattedMarkdownProps> = ({
  content,
}) => {
  // Helper to render inline markdown (bold, italic, inline code, links)
  const renderInline = (text: string) => {
    // Split by code `code`, bold **bold**, italic *italic*, links [text](url)
    const tokens: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining) {
      // Inline Code: `code`
      const codeMatch = remaining.match(/^`([^`]+)`/);
      if (codeMatch) {
        tokens.push(
          <code
            key={key++}
            className="px-1.5 py-0.5 mx-0.5 rounded-md bg-[#180842] border border-[#7042f8]/40 text-cyan-300 font-mono text-[11px] sm:text-xs"
          >
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      // Bold: **text** or __text__
      const boldMatch = remaining.match(/^(\*\*|__)(.*?)\1/);
      if (boldMatch) {
        tokens.push(
          <strong key={key++} className="font-bold text-white">
            {renderInline(boldMatch[2])}
          </strong>
        );
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // Italic: *text* or _text_
      const italicMatch = remaining.match(/^(\*|_)(.*?)\1/);
      if (italicMatch) {
        tokens.push(
          <em key={key++} className="italic text-gray-300">
            {renderInline(italicMatch[2])}
          </em>
        );
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      // Links: [label](url)
      const linkMatch = remaining.match(/^\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        tokens.push(
          <a
            key={key++}
            href={linkMatch[2]}
            target="_blank"
            rel="noreferrer noopener"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition"
          >
            {linkMatch[1]}
          </a>
        );
        remaining = remaining.slice(linkMatch[0].length);
        continue;
      }

      // Regular text up to next special symbol
      const nextSpecial = remaining.search(/[`\*_\[]/);
      if (nextSpecial === -1) {
        tokens.push(remaining);
        break;
      } else if (nextSpecial === 0) {
        // Special character didn't match rules, consume 1 char
        tokens.push(remaining[0]);
        remaining = remaining.slice(1);
      } else {
        tokens.push(remaining.slice(0, nextSpecial));
        remaining = remaining.slice(nextSpecial);
      }
    }

    return tokens;
  };

  // Split content into blocks (code blocks, tables, lists, headings, paragraphs)
  const renderBlocks = (text: string) => {
    const lines = text.split("\n");
    const blocks: React.ReactNode[] = [];
    let i = 0;
    let blockKey = 0;

    while (i < lines.length) {
      const line = lines[i];

      // 1. Code Block: ```lang
      if (line.trim().startsWith("```")) {
        const lang = line.trim().replace(/^```/, "") || "text";
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```

        const codeString = codeLines.join("\n");

        blocks.push(
          <CodeBlock
            key={blockKey++}
            code={codeString}
            language={lang}
          />
        );
        continue;
      }

      // 2. Table: lines starting with |
      if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        const tableLines: string[] = [];
        while (
          i < lines.length &&
          lines[i].trim().startsWith("|") &&
          lines[i].trim().endsWith("|")
        ) {
          tableLines.push(lines[i].trim());
          i++;
        }

        blocks.push(renderTable(tableLines, blockKey++));
        continue;
      }

      // 3. Headings: #, ##, ###
      if (line.startsWith("#")) {
        const match = line.match(/^(#{1,6})\s+(.*)$/);
        if (match) {
          const level = match[1].length;
          const headingText = match[2];

          if (level === 1) {
            blocks.push(
              <h1
                key={blockKey++}
                className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mt-4 mb-2 pb-1 border-b border-purple-500/20"
              >
                {renderInline(headingText)}
              </h1>
            );
          } else if (level === 2) {
            blocks.push(
              <h2
                key={blockKey++}
                className="text-base sm:text-lg font-bold text-cyan-300 mt-3.5 mb-1.5"
              >
                {renderInline(headingText)}
              </h2>
            );
          } else {
            blocks.push(
              <h3
                key={blockKey++}
                className="text-sm sm:text-base font-semibold text-purple-300 mt-2.5 mb-1"
              >
                {renderInline(headingText)}
              </h3>
            );
          }
          i++;
          continue;
        }
      }

      // 4. Bullet lists: starts with - or *
      if (line.trim().match(/^[-*]\s+/)) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].trim().match(/^[-*]\s+/)) {
          listItems.push(lines[i].trim().replace(/^[-*]\s+/, ""));
          i++;
        }
        blocks.push(
          <ul key={blockKey++} className="space-y-1.5 my-2.5 pl-2">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-200">
                <span className="text-cyan-400 text-xs mt-1 select-none">✦</span>
                <span className="flex-1 leading-relaxed">{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // 5. Numbered lists: starts with 1. 2.
      if (line.trim().match(/^\d+\.\s+/)) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].trim().match(/^\d+\.\s+/)) {
          listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
          i++;
        }
        blocks.push(
          <ol key={blockKey++} className="space-y-1.5 my-2.5 pl-2">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-gray-200">
                <span className="px-1.5 py-0.5 rounded-full bg-purple-900/50 border border-purple-500/30 text-[10px] font-mono text-purple-300 select-none">
                  {idx + 1}
                </span>
                <span className="flex-1 leading-relaxed">{renderInline(item)}</span>
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // 6. Blockquote: > text
      if (line.trim().startsWith(">")) {
        const quoteText = line.trim().replace(/^>\s*/, "");
        blocks.push(
          <blockquote
            key={blockKey++}
            className="border-l-2 border-cyan-400 pl-3 my-2 text-gray-300 italic bg-cyan-950/20 py-1 rounded-r-lg"
          >
            {renderInline(quoteText)}
          </blockquote>
        );
        i++;
        continue;
      }

      // 7. Regular paragraph / empty line
      if (!line.trim()) {
        i++;
        continue;
      }

      blocks.push(
        <p key={blockKey++} className="my-1.5 leading-relaxed text-gray-200">
          {renderInline(line)}
        </p>
      );
      i++;
    }

    return blocks;
  };

  // Helper to parse Markdown tables cleanly
  const renderTable = (tableLines: string[], key: number) => {
    if (tableLines.length < 2) return null;

    // First line = Header
    const parseRow = (line: string) =>
      line
        .slice(1, -1)
        .split("|")
        .map((cell) => cell.trim());

    const headerCells = parseRow(tableLines[0]);
    // Skip separator line (line 1 with |---|---|)
    const bodyRows = tableLines.slice(2).map(parseRow);

    return (
      <div
        key={key}
        className="w-full my-4 overflow-x-auto rounded-2xl border border-purple-500/30 bg-[#080221]/90 shadow-xl custom-scrollbar"
      >
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border-b border-purple-500/30">
              {headerCells.map((header, idx) => (
                <th
                  key={idx}
                  className="px-4 py-2.5 font-semibold text-cyan-300 whitespace-nowrap"
                >
                  {renderInline(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/15">
            {bodyRows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="hover:bg-purple-950/30 transition-colors duration-150"
              >
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="px-4 py-2.5 text-gray-300 leading-relaxed align-top"
                  >
                    {renderInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="text-xs sm:text-sm leading-relaxed space-y-1 font-sans">
      {renderBlocks(content)}
    </div>
  );
};

// Copyable Code Block Subcomponent
const CodeBlock: React.FC<{ code: string; language: string }> = ({
  code,
  language,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-2xl overflow-hidden border border-purple-500/40 bg-[#040114] shadow-xl">
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#0e042d] border-b border-purple-500/20 text-xs font-mono text-gray-400">
        <span className="text-cyan-300 font-semibold uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="hover:text-cyan-300 flex items-center gap-1 text-[11px] transition duration-200 cursor-pointer"
        >
          {copied ? (
            <span className="text-green-400 font-sans">✓ Copied!</span>
          ) : (
            <span>📋 Copy code</span>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="p-4 overflow-x-auto font-mono text-xs text-purple-200 leading-relaxed custom-scrollbar">
        <code>{code}</code>
      </pre>
    </div>
  );
};
