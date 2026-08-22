import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

const CopyButton = ({ getText, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(getText());

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${className}`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

const Pre = ({ children }) => {
  const ref = useRef(null);

  return (
    <div className="group relative my-5 overflow-hidden rounded-xl border border-stone-200 bg-[#f7f7f8]">

      {/* Code header */}
      <div className="flex items-center justify-between border-b border-stone-200 bg-stone-100 px-4 py-2">
        <span className="text-xs text-stone-500">
          Code
        </span>

        <CopyButton
          getText={() => ref.current?.innerText ?? ""}
          className="text-stone-500 hover:bg-stone-200 hover:text-stone-900"
        />
      </div>

      {/* Code */}
      <pre
        ref={ref}
        className="overflow-x-auto p-4 text-[13px] leading-6"
      >
        {children}
      </pre>
    </div>
  );
};

const markdownComponents = {
  pre: Pre,

  code: ({ children, className, ...props }) => {
    const isCodeBlock = className?.includes("language-");

    if (isCodeBlock) {
      return (
        <code
          {...props}
          className={`${className} text-[13px]`}
        >
          {children}
        </code>
      );
    }

    return (
      <code
        {...props}
        className="rounded-md bg-stone-200 px-1.5 py-0.5 text-[0.875em] font-medium text-stone-800"
      >
        {children}
      </code>
    );
  },

  p: ({ children }) => (
    <p className="my-3 leading-7 first:mt-0 last:mb-0">
      {children}
    </p>
  ),

  ul: ({ children }) => (
    <ul className="my-3 list-disc space-y-1.5 pl-6 marker:text-stone-500">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="my-3 list-decimal space-y-1.5 pl-6 marker:text-stone-500">
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li className="leading-7 [&>p]:my-0">
      {children}
    </li>
  ),

  h1: ({ children }) => (
    <h1 className="mb-3 mt-6 text-xl font-semibold first:mt-0">
      {children}
    </h1>
  ),

  h2: ({ children }) => (
    <h2 className="mb-3 mt-6 text-lg font-semibold first:mt-0">
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="mb-2 mt-5 text-base font-semibold first:mt-0">
      {children}
    </h3>
  ),

  a: ({ children, ...props }) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-stone-900 underline underline-offset-2"
    >
      {children}
    </a>
  ),

  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 border-stone-300 pl-4 italic text-stone-600">
      {children}
    </blockquote>
  ),

  hr: () => (
    <hr className="my-6 border-stone-200" />
  ),

  table: ({ children }) => (
    <div className="my-5 overflow-x-auto rounded-lg border border-stone-200">
      <table className="w-full border-collapse text-sm">
        {children}
      </table>
    </div>
  ),

  th: ({ children }) => (
    <th className="border-b border-stone-200 bg-stone-50 px-3 py-2 text-left font-semibold">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="border-b border-stone-100 px-3 py-2 align-top">
      {children}
    </td>
  ),
};

const MessageBubble = ({
  role,
  content,
  type,
  image,
}) => {
  const isUser = role === "user";

  // USER
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-stone-900 px-4 py-2.5 leading-7 text-white sm:max-w-[75%]">
          {content}
        </div>
      </div>
    );
  }

  // ASSISTANT
  return (
    <div className="group/msg min-w-0 text-stone-800">

      {/* IMAGE */}
      {type === "image" && image ? (
        <div className="space-y-2">

          <a
            href={image}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-fit"
          >
            <img
              src={image}
              alt="Generated image"
              loading="lazy"
              className="max-h-[500px] max-w-full rounded-xl border border-stone-200 transition-opacity hover:opacity-90"
            />
          </a>

          {content && (
            <p className="text-sm text-stone-500">
              {content}
            </p>
          )}

        </div>
      ) : (

        /* MARKDOWN */
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={markdownComponents}
        >
          {content || ""}
        </ReactMarkdown>
      )}

      {/* COPY WHOLE RESPONSE */}
      {content && (
        <CopyButton
          getText={() => content}
          className="mt-2 -ml-2 text-stone-400 opacity-0 hover:bg-stone-900/5 hover:text-stone-700 focus-visible:opacity-100 group-hover/msg:opacity-100"
        />
      )}
    </div>
  );
};

export default MessageBubble;