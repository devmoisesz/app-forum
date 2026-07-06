import { InMemoryAnswerAttachmentRepository } from "@/test/repositories-in-memory/in-memory-answer-attachments-repository";
import { EditAnswerUseCase } from "./edit-answer";
import { InMemoryAnswerRepository } from "@/test/repositories-in-memory/in-memory-answers-repository";
import { makeAnswer } from "@/test/factories/make-answer";
import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";
import { makeAnswerAttachment } from "@/test/factories/make-answer-attachment";
import { NotAllowedError } from "@/src/core/error/errors/not-allowed-error";

let answerAttachmentsRepository: InMemoryAnswerAttachmentRepository;
let answersRepository: InMemoryAnswerRepository;
let editAnswerUseCase: EditAnswerUseCase;

describe("Edit Answer", () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentRepository();
    answersRepository = new InMemoryAnswerRepository(
      answerAttachmentsRepository
    );
    editAnswerUseCase = new EditAnswerUseCase(
      answersRepository,
      answerAttachmentsRepository,
    );
  });

  it("should be able to edit a answer", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1"),
    );

    answersRepository.create(newAnswer);

    answerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID("1"),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID("2"),
      }),
    );

    await editAnswerUseCase.execute({
      answerId: newAnswer.id.toValue(),
      authorId: "author-1",
      content: "test content",
      attachmentsIds: ["1", "3"],
    });

    expect(answersRepository.items[0]).toMatchObject({
      content: "test content",
    });
    expect(answersRepository.items[0]?.attachments.currentItems).toHaveLength(
      2,
    );

    expect(answersRepository.items[0]?.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("3") }),
    ]);
  });

  it("should not be able to edit a answer", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1"),
    );

    answersRepository.create(newAnswer);

    const result = await editAnswerUseCase.execute({
      answerId: newAnswer.id.toValue(),
      authorId: "author-2",
      content: "test content",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should sync new and removed attachments when editing an answer", async () => {
      const newAnswer = makeAnswer(
        {
          authorId: new UniqueEntityID("author-1"),
        },
        new UniqueEntityID("answer-1"),
      );
  
      await answersRepository.create(newAnswer);
  
      answerAttachmentsRepository.items.push(
        makeAnswerAttachment({
          answerId: newAnswer.id,
          attachmentId: new UniqueEntityID("1"),
        }),
        makeAnswerAttachment({
          answerId: newAnswer.id,
          attachmentId: new UniqueEntityID("2"),
        }),
      );
  
      const result = await editAnswerUseCase.execute({
        answerId: newAnswer.id.toValue(),
        authorId: "author-1",
        content: "test content",
        attachmentsIds: ["1", "3"],
      });
  
      expect(result.isRight()).toBe(true);
      expect(answerAttachmentsRepository.items).toHaveLength(2);
      expect(answerAttachmentsRepository.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            attachmentId: new UniqueEntityID("1"),
          }),
          expect.objectContaining({
            attachmentId: new UniqueEntityID("3"),
          }),
        ]),
      );
    });
});
