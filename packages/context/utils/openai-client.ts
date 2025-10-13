import OpenAI from "openai";

export class OpenAIClientSingleton {
  private static instance: OpenAI;

  private constructor() {}

  public static getInstance(): OpenAI {
    if (!OpenAIClientSingleton.instance) {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY environment variable is required");
      }

      OpenAIClientSingleton.instance = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    return OpenAIClientSingleton.instance;
  }
}
