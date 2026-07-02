import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";
import { InMemoryAnswerRepository } from "../../../../../test/repositories-in-memory/in-memory-answers-repository";
import { DeleteAnswerUseCase } from "./delete-answer";
import { makeAnswer } from "@/test/factories/make-answer";
import { InMemoryAnswerAttachmentRepository } from "@/test/repositories-in-memory/in-memory-answer-attachments-repository";
import { makeAnswerAttachment } from "@/test/factories/make-answer-attachment";
import { NotAllowedError } from "@/src/core/error/errors/not-allowed-error";

let answersAttachmentsRepository: InMemoryAnswerAttachmentRepository;
let answerRepository: InMemoryAnswerRepository;
let deleteAnswerUseCase: DeleteAnswerUseCase;

describe("Delete Answer", () => {
  beforeEach(() => {
    answersAttachmentsRepository = new InMemoryAnswerAttachmentRepository();
    answerRepository = new InMemoryAnswerRepository(
      answersAttachmentsRepository,
    );
    deleteAnswerUseCase = new DeleteAnswerUseCase(answerRepository);
  });

  it("should be able to delete a answer from another user", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1"),
    );

    await answerRepository.create(newAnswer);

    answersAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID("1"),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID("2"),
      }),
    );

    await deleteAnswerUseCase.execute({
      answerId: "answer-1",
      authorId: "author-1",
    });

    expect(answerRepository.items).toHaveLength(0);
    expect(answersAttachmentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a answer from another user", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1"),
    );

    answerRepository.create(newAnswer);

    const result = await deleteAnswerUseCase.execute({
      answerId: "answer-1",
      authorId: "author-2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
