import ReactMarkdown from "react-markdown";
import type { MessagePart, ToolViews } from "./types";

interface MessagePartProps {
  part: any; // Use any to handle Arc framework types flexibly
  toolViews?: ToolViews;
}

export const MessagePartComponent = ({ part, toolViews }: MessagePartProps) => {
  if (part.type === "text") {
    return (
      <div className="text-gray-800 prose prose-sm max-w-none">
        <ReactMarkdown
          components={{
            ul: ({ children }) => (
              <ul className="list-disc list-outside ml-4 space-y-1 my-2 text-gray-700">
                {children}
              </ul>
            ),
            li: ({ children }) => (
              <li className="text-gray-700 leading-relaxed">{children}</li>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-outside ml-4 space-y-1 my-2 text-gray-700">
                {children}
              </ol>
            ),
            p: ({ children }) => (
              <p className="text-gray-800 leading-relaxed mb-2">{children}</p>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="italic text-gray-700">{children}</em>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-base font-semibold text-gray-900 mt-3 mb-2">
                {children}
              </h4>
            ),
            code: ({ children }) => (
              <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800">
                {children}
              </code>
            ),
          }}
        >
          {part.value}
        </ReactMarkdown>
      </div>
    );
  }

  if (part.type === "tool") {
    // Check if there's a custom tool view for this tool
    const CustomToolView = toolViews?.[part.name];
    
    if (CustomToolView) {
      return (
        <CustomToolView
          toolName={part.name}
          params={part.params}
          result={part.result}
        />
      );
    }

    // Fallback to generic tool view
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">
            Tool executed: {part.name}
          </span>
        </div>
        <div className="text-xs text-gray-600">
          Tool was called successfully
        </div>
      </div>
    );
  }

  // Fallback for unknown part types
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
      <div className="text-xs font-medium text-yellow-700 mb-1">
        Unknown part type: {(part as any).type}
      </div>
      <pre className="text-xs font-mono text-yellow-800 overflow-x-auto">
        {JSON.stringify(part, null, 2)}
      </pre>
    </div>
  );
};