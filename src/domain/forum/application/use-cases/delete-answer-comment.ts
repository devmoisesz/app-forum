import { Either, left, right } from "@/src/core/either";
import type { AnswerCommentRepository } from "../repositories/answer-comment-repository";
import { NotAllowedError } from "@/src/core/error/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/src/core/error/errors/resource-not-found-error";


interface DeleteAnswerCommentUseCaseRequest {
  authorId: string;
  answerCommentId: string;
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentRepository: AnswerCommentRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentRepository.findById(answerCommentId);

    if (!answerComment) {
      return left(new ResourceNotFoundError());
    }

    if (answerComment.authorId.toString() != authorId) {
      return left(new NotAllowedError());
    }

    await this.answerCommentRepository.delete(answerComment);

    return right(null);
  }
}
