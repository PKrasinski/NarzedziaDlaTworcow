import React from "react";

// Message part types
export interface TextMessagePart {
  type: "text";
  value: string;
}

export interface ToolMessagePart {
  type: "tool";
  name: string;
  params?: unknown;
  result?: unknown;
}

export type MessagePart = TextMessagePart | ToolMessagePart;

// Tool view types
export interface ToolViewProps {
  toolName: string;
  params?: unknown;
  result?: unknown;
}

export type ToolViewComponent = React.ComponentType<ToolViewProps>;
export type ToolViews = Record<string, ToolViewComponent>;
