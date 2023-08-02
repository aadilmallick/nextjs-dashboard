"use client";
import React, { use, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./calendar.scss";
import Script from "next/script";
import Prism from "prismjs";
import "prismjs/components";
import "prismjs/themes/prism-twilight.css";

const MarkdownTab = () => {
  const [markdown, setMarkdown] = useState("## markdown preview");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setMarkdown(localStorage.getItem("markdown") || "");
  }, []);

  const hiddenPreviewContent = () => {
    if (showPreview) {
      return null;
    }
    return (
      <textarea
        className="p-1 pt-8 w-full h-[90%] overflow-auto text-gray-700 bg-gray-100 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        value={markdown}
        onChange={(e) => {
          setMarkdown(e.target.value);
          localStorage.setItem("markdown", e.target.value);
        }}
      ></textarea>
    );
  };

  const showPreviewContent = () => {
    if (!showPreview) {
      return null;
    }

    return (
      <article
        id="markdown-output"
        className="pt-8 max-h-[90%] overflow-y-auto"
      >
        <ReactMarkdown
          components={{
            code: ({ node, inline, className, children, ...props }) => {
              if (inline) {
                return <code>{children}</code>;
              }
              return <CodeBlock className={className!}>{children}</CodeBlock>;
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </article>
    );
  };

  const activeTabClass = (bool: boolean) => {
    return bool
      ? "bg-purple-500 border-none font-semibold text-white"
      : "bg-transparent border-none font-semibold ";
  };
  return (
    <>
      <div className="card h-full">
        <div className="max-w-xs h-8 rounded-t-lg border border-gray-300 grid grid-cols-2 overflow-hidden">
          <button
            className={`${activeTabClass(!showPreview)}`}
            onClick={() => setShowPreview(false)}
          >
            Edit
          </button>
          <button
            className={`${activeTabClass(showPreview)}`}
            onClick={() => setShowPreview(true)}
          >
            Preview
          </button>
        </div>
        <div className="flex flex-col h-full">
          {hiddenPreviewContent()}
          {showPreviewContent()}
        </div>
      </div>
    </>
  );
};

interface CodeBlockProps {
  className: string;
  children: React.ReactNode;
}

const CodeBlock = ({ className, children }: CodeBlockProps) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      Prism.highlightAll();
    }
  }, []);
  return (
    <div>
      <pre className="max-w-xl overflow-auto">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
};

// function CodeBlock({ language, value, ...props }: any) {
//   const handleCopyToClipboard = () => {
//     //   copy(value);
//     navigator.clipboard.writeText(value);
//     alert("Code copied to clipboard!");
//   };

//   return (
//     <div className="code-block w-auto">
//       <button className="copy-btn" onClick={handleCopyToClipboard}>
//         Copy
//       </button>
//       <pre>
//         <code className={language} {...props}>
//           {value}
//         </code>
//       </pre>
//     </div>
//   );
// }

export default MarkdownTab;
