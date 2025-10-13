export class VoiceRecorder {
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
