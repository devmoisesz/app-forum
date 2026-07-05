import { Module } from "@nestjs/common";
import { EnvModule } from "../env/env.module";
import { Uploader } from "@/src/domain/forum/storage/uploader";
import { MinioStorage } from "./minio-storage";

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: MinioStorage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
