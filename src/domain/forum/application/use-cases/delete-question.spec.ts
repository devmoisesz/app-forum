import { makeQuestion } from "@/test/factories/make-question";
import { DeleteQuestionUseCase } from "./delete-question";
import { InMemoryQuestionAttachmentRepository } from "@/test/repositories-in-memory/in-memory-question-attachments-repository";
import { InMemoryQuestionRepository } from "@/test/repositories-in-memory/in-memory-questions-repository";
import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";
import { makeQuestionAttachment } from "@/test/factories/make-question-attachment";
import { NotAllowedError } from "@/src/core/error/errors/not-allowed-error";

let questionsRepository: InMemoryQuestionRepository;
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let deleteQuestionUseCase: DeleteQuestionUseCase;

describe("Delete Question", () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
    questionsRepository = new InMemoryQuestionRepository(
      questionAttachmentRepository,
    );

    deleteQuestionUseCase = new DeleteQuestionUseCase(questionsRepository);
  });

  it("should be able to delete a question from another user", async () => {
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

    await deleteQuestionUseCase.execute({
      questionId: "question-1",
      authorId: "author-1",
    });

    expect(questionsRepository.items).toHaveLength(0);
    expect(questionAttachmentRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a question from another user", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1"),
    );

    questionsRepository.create(newQuestion);

    const result = await deleteQuestionUseCase.execute({
      questionId: "question-1",
      authorId: "author-2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
