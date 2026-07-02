import { InMemoryQuestionAttachmentRepository } from "@/test/repositories-in-memory/in-memory-question-attachments-repository";
import { EditQuestionUseCase } from "./edit-question";
import { InMemoryQuestionRepository } from "@/test/repositories-in-memory/in-memory-questions-repository";
import { makeQuestion } from "@/test/factories/make-question";
import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";
import { makeQuestionAttachment } from "@/test/factories/make-question-attachment";
import { NotAllowedError } from "@/src/core/error/errors/not-allowed-error";

let questionsRepository: InMemoryQuestionRepository;
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let editQuestionUseCase: EditQuestionUseCase;

describe("Edit Question", () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
    questionsRepository = new InMemoryQuestionRepository(
      questionAttachmentRepository,
    );

    editQuestionUseCase = new EditQuestionUseCase(
      questionsRepository,
      questionAttachmentRepository,
    );
  });

  it("should be able to edit a question", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1"),
    );

    await questionsRepository.create(newQuestion);

    questionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID("1"),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID("2"),
      }),
    );

    await editQuestionUseCase.execute({
      questionId: newQuestion.id.toValue(),
      authorId: "author-1",
      title: "test question",
      content: "test content",
      attachmentsIds: ["1", "3"],
    });

    expect(questionsRepository.items[0]).toMatchObject({
      title: "test question",
      content: "test content",
    });
    expect(questionsRepository.items[0]?.attachments.currentItems).toHaveLength(
      2,
    );

    expect(questionsRepository.items[0]?.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("3") }),
    ]);
  });

  it("should not be able to edit a question", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1"),
    );

    questionsRepository.create(newQuestion);

    const result = await editQuestionUseCase.execute({
      questionId: newQuestion.id.toValue(),
      authorId: "author-2",
      title: "test question",
      content: "test content",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
