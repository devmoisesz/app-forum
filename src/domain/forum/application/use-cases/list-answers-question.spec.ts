import { InMemoryAnswerAttachmentRepository } from "@/test/repositories-in-memory/in-memory-answer-attachments-repository";
import { ListAnswersOfQuestionUseCase } from "./list-answers-question";
import { InMemoryAnswerRepository } from "@/test/repositories-in-memory/in-memory-answers-repository";
import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";
import { makeAnswer } from "@/test/factories/make-answer";

let answersAttachmentsRepository: InMemoryAnswerAttachmentRepository;
let answersRepository: InMemoryAnswerRepository;
let listAnswersOfQuestionUseCase: ListAnswersOfQuestionUseCase;

describe("List Answers of Question", () => {
  beforeEach(() => {
    answersAttachmentsRepository = new InMemoryAnswerAttachmentRepository();
    answersRepository = new InMemoryAnswerRepository(
      answersAttachmentsRepository,
    );
    listAnswersOfQuestionUseCase = new ListAnswersOfQuestionUseCase(
      answersRepository,
    );
  });

  it("should be able to list answers of question", async () => {
    await answersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID("1"),
      }),
    );
    await answersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID("1"),
      }),
    );
    await answersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID("1"),
      }),
    );

    const result = await listAnswersOfQuestionUseCase.execute({
      questionId: "1",
      page: 1,
    });

    expect(result.value?.answers).toHaveLength(3);
  });

  it("should be able to fetch paginated answers of question", async () => {
    for (let i = 1; i <= 22; i++) {
      await answersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityID("1"),
        }),
      );
    }

    const result = await listAnswersOfQuestionUseCase.execute({
      questionId: "1",
      page: 2,
    });

    expect(result.value?.answers).toHaveLength(2);
  });
});
