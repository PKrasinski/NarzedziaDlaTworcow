import { S3Client } from "bun";

class S3ClientSingleton {
  private static instance: S3Client;

  private constructor() {}

  public static getInstance(): S3Client {
    if (!S3ClientSingleton.instance) {
      const isProduction = process.env.NODE_ENV === "production";

      S3ClientSingleton.instance = new S3Client({
        accessKeyId:
          process.env.S3_ACCESS_KEY || (isProduction ? "" : "minioadmin"),
        secretAccessKey:
          process.env.S3_SECRET_KEY || (isProduction ? "" : "minioadmin123"),
        bucket: process.env.S3_BUCKET || "content-uploads",
        endpoint:
          process.env.S3_ENDPOINT ||
          (isProduction ? "" : "http://localhost:9000"),
      });
    }

    return S3ClientSingleton.instance;
  }
}

export const s3Client = S3ClientSingleton.getInstance();
