"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface ChatContextType {
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  recording: boolean;
  recordingTime: number;
  toggleRecording: () => void;
  error: string;
  setError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function useChatDialog() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatDialog must be used within a ChatProvider");
  }
  return context;
}

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  // Handle recording timer
  useEffect(() => {
    if (recording) {
      recordingInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [recording]);

  const openDialog = () => {
    setIsDialogOpen(true);
    setError("");
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setError("");
  };

  const toggleRecording = () => {
    setRecording(!recording);
    if (recording) {
      // Here you would normally save the recording
      // Recording stopped
    }
  };

  const value: ChatContextType = {
    isDialogOpen,
    openDialog,
    closeDialog,
    recording,
    recordingTime,
    toggleRecording,
    error,
    setError,
    isLoading,
    setIsLoading,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
