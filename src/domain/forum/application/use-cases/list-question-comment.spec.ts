import { InMemoryQuestionCommentRepository } from "@/test/repositories-in-memory/in-memory-question-comment-repository";
import { ListQuestionCommentsUseCase } from "./list-question-comment";
import { makeQuestionComment } from "@/test/factories/make-question-comment";
import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";


let questionCommentRepository: InMemoryQuestionCommentRepository;
let listQuestionCommentsUseCase: ListQuestionCommentsUseCase;

describe("List QuestionComment of Question", () => {
  beforeEach(() => {
    questionCommentRepository = new InMemoryQuestionCommentRepository();
    listQuestionCommentsUseCase = new ListQuestionCommentsUseCase(
      questionCommentRepository,
    );
  });

  it("should be able to list question comments", async () => {
    await questionCommentRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID("1"),
      }),
    );
    await questionCommentRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID("1"),
      }),
    );
    await questionCommentRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID("1"),
      }),
    );

    const result = await listQuestionCommentsUseCase.execute({
      questionId: "1",
      page: 1,
    });

    expect(result.value?.questionComments).toHaveLength(3);
  });

  it("should be able to fetch paginated question comments", async () => {
    for (let i = 1; i <= 22; i++) {
      await questionCommentRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID("1"),
        }),
      );
    }

    const result = await listQuestionCommentsUseCase.execute({
      questionId: "1",
      page: 2,
    });

    expect(result.value?.questionComments).toHaveLength(2);
  });
});
