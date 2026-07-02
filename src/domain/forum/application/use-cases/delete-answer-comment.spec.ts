import { InMemoryAnswerCommentRepository } from "@/test/repositories-in-memory/in-memory-answer-comment-repository";
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";
import { makeAnswerComment } from "@/test/factories/make-answer-comment";
import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";
import { NotAllowedError } from "@/src/core/error/errors/not-allowed-error";

let answerCommentRepository: InMemoryAnswerCommentRepository;
let deleteAnswerCommentUseCase: DeleteAnswerCommentUseCase;

describe("Delete answer Comment", () => {
  beforeEach(() => {
    answerCommentRepository = new InMemoryAnswerCommentRepository();

    deleteAnswerCommentUseCase = new DeleteAnswerCommentUseCase(
      answerCommentRepository,
    );
  });

  it("should be able to delete a answer comment", async () => {
    const answerComment = makeAnswerComment();

    await answerCommentRepository.create(answerComment);

    await deleteAnswerCommentUseCase.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    });

    expect(answerCommentRepository.items).toHaveLength(0);
  });

  it("should not be able to delete another user answer comment", async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID("1"),
    });

    await answerCommentRepository.create(answerComment);

    const result = await deleteAnswerCommentUseCase.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: "2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
