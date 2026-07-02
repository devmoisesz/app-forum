import { InMemoryQuestionCommentRepository } from "@/test/repositories-in-memory/in-memory-question-comment-repository";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { makeQuestionComment } from "@/test/factories/make-question-comment";
import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";
import { NotAllowedError } from "@/src/core/error/errors/not-allowed-error";

let questionCommentRepository: InMemoryQuestionCommentRepository;
let deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase;

describe("Delete question Comment", () => {
  beforeEach(() => {
    questionCommentRepository = new InMemoryQuestionCommentRepository();

    deleteQuestionCommentUseCase = new DeleteQuestionCommentUseCase(
      questionCommentRepository,
    );
  });

  it("should be able to delete a question comment", async () => {
    const questionComment = makeQuestionComment();

    await questionCommentRepository.create(questionComment);

    await deleteQuestionCommentUseCase.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    });

    expect(questionCommentRepository.items).toHaveLength(0);
  });

  it("should not be able to delete another user question comment", async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID("1"),
    });

    await questionCommentRepository.create(questionComment);

    const result = await deleteQuestionCommentUseCase.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: "2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
