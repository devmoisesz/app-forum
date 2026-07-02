import { InMemoryQuestionAttachmentRepository } from "@/test/repositories-in-memory/in-memory-question-attachments-repository";
import { CreateQuestionUseCase } from "./create-question";
import { InMemoryQuestionRepository } from "@/test/repositories-in-memory/in-memory-questions-repository";
import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";

let questionsRepository: InMemoryQuestionRepository;
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let createQuestionUseCase: CreateQuestionUseCase;

describe("Create Question", () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
    questionsRepository = new InMemoryQuestionRepository(questionAttachmentRepository);
    createQuestionUseCase = new CreateQuestionUseCase(questionsRepository);
  });

  it("should be able to create question", async () => {
    const result = await createQuestionUseCase.execute({
      authorId: "1",
      title: "new question",
      content: "Content question",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isRight()).toBe(true);
    expect(questionsRepository.items[0]).toEqual(result.value?.question);
    expect(questionsRepository.items[0]?.attachments.currentItems).toHaveLength(2);
    expect(questionsRepository.items[0]?.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("2") }),
    ]);
  });
});
