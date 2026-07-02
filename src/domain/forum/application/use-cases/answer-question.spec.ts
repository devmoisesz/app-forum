import { InMemoryAnswerRepository } from "../../../../../test/repositories-in-memory/in-memory-answers-repository";
import { AnswerQuestionUseCase } from "./answer-question";
import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";
import { InMemoryAnswerAttachmentRepository } from "../../../../../test/repositories-in-memory/in-memory-answer-attachments-repository";

let answersAttachmentsRepository: InMemoryAnswerAttachmentRepository
let answerRepository: InMemoryAnswerRepository;
let answerUseCase: AnswerQuestionUseCase;

describe("Create Question", () => {
  beforeEach(() => {
    answersAttachmentsRepository = new InMemoryAnswerAttachmentRepository()
    answerRepository = new InMemoryAnswerRepository(answersAttachmentsRepository);
    answerUseCase = new AnswerQuestionUseCase(answerRepository);
  });

  it("should be able to create an answer", async () => {
    const result = await answerUseCase.execute({
      questionId: "1",
      instructorId: "1",
      content: "new content",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isRight()).toBe(true);
    expect(answerRepository.items[0]).toEqual(result.value?.answer);
    expect(answerRepository.items[0]?.attachments.currentItems).toHaveLength(2);
    expect(answerRepository.items[0]?.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("2") }),
    ]);
  });
});
