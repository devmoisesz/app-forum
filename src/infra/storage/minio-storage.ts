import { Uploader, UploadParams } from "@/src/domain/forum/storage/uploader";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { EnvService } from "../env/env.service";
import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MinioStorage implements Uploader {
  private client: S3Client;

  constructor(private envService: EnvService) {
    this.client = new S3Client({
      endpoint: this.envService.get("MINIO_ENDPOINT"),
      region: "us-east-1",
      credentials: {
        accessKeyId: this.envService.get("MINIO_ACCESS_KEY"),
        secretAccessKey: this.envService.get("MINIO_SECRET_KEY"),
      },
      forcePathStyle: true,
    });
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${fileName}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get("MINIO_BUCKET"),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    );

    return {
      url: uniqueFileName,
    };
  }
}
