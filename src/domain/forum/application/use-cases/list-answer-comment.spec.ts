import { InMemoryAnswerCommentRepository } from "@/test/repositories-in-memory/in-memory-answer-comment-repository";
import { ListAnswerCommentsUseCase } from "./list-answer-comment";
import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";
import { makeAnswerComment } from "@/test/factories/make-answer-comment";

let answerCommentRepository: InMemoryAnswerCommentRepository;
let listAnswerCommentsUseCase: ListAnswerCommentsUseCase;

describe("List AnswerComment of Answer", () => {
  beforeEach(() => {
    answerCommentRepository = new InMemoryAnswerCommentRepository();
    listAnswerCommentsUseCase = new ListAnswerCommentsUseCase(
      answerCommentRepository,
    );
  });

  it("should be able to list answer comments", async () => {
    await answerCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("1"),
      }),
    );
    await answerCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("1"),
      }),
    );
    await answerCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("1"),
      }),
    );

    const result = await listAnswerCommentsUseCase.execute({
      answerId: "1",
      page: 1,
    });

    expect(result.value?.answerComments).toHaveLength(3);
  });

  it("should be able to fetch paginated answer comments", async () => {
    for (let i = 1; i <= 22; i++) {
      await answerCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID("1"),
        }),
      );
    }

    const result = await listAnswerCommentsUseCase.execute({
      answerId: "1",
      page: 2,
    });

    expect(result.value?.answerComments).toHaveLength(2);
  });
});
