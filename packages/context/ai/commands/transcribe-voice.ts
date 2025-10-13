import { command, file, string, stringEnum, boolean } from "@arcote.tech/arc";

// Whisper API transcription function
async function transcribeAudio(audioFile: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("model", "whisper-1");
    formData.append("response_format", "text");

    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Whisper API error: ${response.status} ${response.statusText}`
      );
    }

    const transcription = await response.text();
    return transcription.trim();
  } catch (error) {
    console.error("Whisper transcription failed:", error);
    throw new Error("Failed to transcribe audio file");
  }
}

export default command("transcribeVoice")
  .withParams({
    voiceMessage: file()
      .types([
        "audio/mp3",
        "audio/wav",
        "audio/m4a",
        "audio/ogg",
        "audio/webm",
        "audio/webm;codecs=opus",
      ])
      .maxSize(10 * 1024 * 1024), // 10MB max
  })
  .withResult(
    {
      error: stringEnum("TRANSCRIPTION_FAILED"),
    },
    {
      success: boolean(),
      transcription: string(),
    }
  )
  .handle(
    ONLY_SERVER &&
      (async (_ctx, { voiceMessage }) => {
        try {
          // Transcribe audio using Whisper
          const transcription = await transcribeAudio(voiceMessage);

          return { success: true, transcription } as const;
        } catch (error) {
          console.error("Voice transcription failed:", error);
          return { error: "TRANSCRIPTION_FAILED" } as const;
        }
      })
  );