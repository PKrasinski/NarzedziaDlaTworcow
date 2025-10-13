import { useDesignSystem } from "design-system";
import { Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Voice recorder utility class
class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async startRecording(): Promise<void> {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      // Create MediaRecorder with webm format (widely supported)
      const options = { mimeType: "audio/webm;codecs=opus" };

      // Fallback to other formats if webm is not supported
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.warn("webm not supported, trying mp4");
        options.mimeType = "audio/mp4";

        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.warn("mp4 not supported, using default");
          delete (options as any).mimeType;
        }
      }

      this.mediaRecorder = new MediaRecorder(this.stream, options);
      this.audioChunks = [];

      // Collect audio data as it becomes available
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Start recording
      this.mediaRecorder.start(100); // Collect data every 100ms
    } catch (error) {
      console.error("Error starting voice recording:", error);
      throw new Error(
        "Could not start voice recording. Please check microphone permissions."
      );
    }
  }

  async stopRecording(): Promise<File> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("No recording in progress"));
        return;
      }

      this.mediaRecorder.onstop = () => {
        try {
          // Create blob from recorded chunks
          const mimeType = this.mediaRecorder?.mimeType || "audio/webm";
          const audioBlob = new Blob(this.audioChunks, { type: mimeType });

          // Create File object with appropriate extension
          const extension = mimeType.includes("webm")
            ? "webm"
            : mimeType.includes("mp4")
            ? "m4a"
            : "wav";
          const fileName = `voice-message-${Date.now()}.${extension}`;

          const audioFile = new File([audioBlob], fileName, {
            type: mimeType,
            lastModified: Date.now(),
          });

          // Clean up
          this.cleanup();

          resolve(audioFile);
        } catch (error) {
          reject(error);
        }
      };

      this.mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        reject(new Error("Recording error occurred"));
      };

      // Stop recording
      this.mediaRecorder.stop();
    });
  }

  private cleanup(): void {
    // Stop all tracks to release microphone
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === "recording";
  }

  // Static method to check if voice recording is supported
  static isSupported(): boolean {
    return !!(
      typeof navigator !== "undefined" &&
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === "function" &&
      typeof window !== "undefined" &&
      window.MediaRecorder
    );
  }
}

interface VoiceRecorderProps {
  onTranscriptionComplete: (transcription: string) => void;
  transcribeVoice: (params: { voiceMessage: File }) => Promise<any>;
  onRecordingStart?: () => void;
  onRecordingEnd?: () => void;
  autoStart?: boolean;
}

export const VoiceRecorderComponent = ({
  onTranscriptionComplete,
  onRecordingStart,
  onRecordingEnd,
  autoStart = false,
  transcribeVoice,
}: VoiceRecorderProps) => {
  const { Button } = useDesignSystem();
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const voiceRecorderRef = useRef<VoiceRecorder | null>(null);

  // Check voice recording support on mount
  useEffect(() => {
    setIsVoiceSupported(VoiceRecorder.isSupported());
  }, []);

  // Auto-start recording if requested
  useEffect(() => {
    if (autoStart && isVoiceSupported && !recording && !isProcessing) {
      handleVoiceRecording();
    }
  }, [autoStart, isVoiceSupported]);

  // Recording timer - stop when processing starts
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recording && !isProcessing) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [recording, isProcessing]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleVoiceRecording = async () => {
    try {
      if (!recording) {
        // Start recording
        if (!voiceRecorderRef.current) {
          voiceRecorderRef.current = new VoiceRecorder();
        }
        await voiceRecorderRef.current.startRecording();
        setRecording(true);
        setRecordingTime(0);
        setIsProcessing(false);
        onRecordingStart?.();
      } else {
        // Stop recording and process
        if (voiceRecorderRef.current) {
          setIsProcessing(true);
          const audioFile = await voiceRecorderRef.current.stopRecording();
          
          try {
            // Transcribe the audio using the provided command
            const result = await transcribeVoice({ voiceMessage: audioFile });
            
            if ("success" in result && result.success && result.transcription) {
              // Return the transcription to the parent component
              onTranscriptionComplete(result.transcription);
            } else {
              console.error("Transcription failed:", result);
              if ("error" in result && result.error === "TRANSCRIPTION_FAILED") {
                toast.error("Błąd transkrypcji", {
                  description: "Nie udało się przepisać wiadomości głosowej na tekst",
                });
              } else {
                toast.error("Błąd", {
                  description: "Nie udało się przetworzyć wiadomości głosowej",
                });
              }
            }
          } catch (error) {
            console.error("Voice transcription error:", error);
            toast.error("Błąd", {
              description: "Nie udało się przetworzyć wiadomości głosowej",
            });
          }
        }
        setRecording(false);
        setIsProcessing(false);
        onRecordingEnd?.();
      }
    } catch (error: any) {
      console.error("Voice recording error:", error);
      toast.error("Błąd nagrywania", {
        description: error.message || "Nie udało się nagrać wiadomości głosowej",
      });
      setRecording(false);
      setIsProcessing(false);
      onRecordingEnd?.();
    }
  };

  const handleCancelRecording = () => {
    if (voiceRecorderRef.current) {
      voiceRecorderRef.current.stopRecording().catch(console.error);
    }
    setRecording(false);
    setRecordingTime(0);
    setIsProcessing(false);
    onRecordingEnd?.();
  };

  if (!isVoiceSupported) {
    return null;
  }

  if (recording || isProcessing) {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-4">
          {/* Recording Indicator */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
              <div className="relative flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full">
                <Mic className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-blue-900">
                {isProcessing ? "Przetwarzanie..." : "Nagrywanie..."}
              </div>
              <div className="text-lg font-mono text-blue-600">
                {formatTime(recordingTime)}
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={handleCancelRecording}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-800 border-gray-300"
              disabled={isProcessing}
            >
              Anuluj
            </Button>
            <Button
              type="button"
              onClick={handleVoiceRecording}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Przetwarzanie...
                </>
              ) : (
                "Zamień na tekst"
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleVoiceRecording}
      className="p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-700"
    >
      <Mic className="w-4 h-4" />
    </button>
  );
};
