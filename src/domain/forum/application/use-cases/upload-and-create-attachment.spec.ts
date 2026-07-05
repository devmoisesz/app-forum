import { InMemoryAttachmenttRepository } from "@/test/repositories-in-memory/in-memory-attachments-repository";
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment";
import { FakeUploader } from "@/test/storage/fake-uploader";
import { InvalidAttachmentType } from "./errors/invalid-attachment-type";

let attachmentsRepository: InMemoryAttachmenttRepository;
let fakeUploader: FakeUploader;
let uploadAndCreateAttachmentUseCase: UploadAndCreateAttachmentUseCase;

describe("Upload and create attachment", () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmenttRepository();
    fakeUploader = new FakeUploader();
    uploadAndCreateAttachmentUseCase = new UploadAndCreateAttachmentUseCase(
      attachmentsRepository,
      fakeUploader,
    );
  });

  it("should be able upload and create an attachment", async () => {
    const result = await uploadAndCreateAttachmentUseCase.execute({
      fileName: "profile.png",
      fileType: "image/png",
      body: Buffer.from(""),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      attachment: attachmentsRepository.items[0],
    });
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: "profile.png",
      }),
    );
  });

  it("should not be able to upload an attachment with invalid file type", async () => {
    const result = await uploadAndCreateAttachmentUseCase.execute({
      fileName: "profile.mp3",
      fileType: "audio/mpeg",
      body: Buffer.from(""),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAttachmentType);
  });
});
