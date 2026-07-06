import { Injectable } from "@nestjs/common";
import { right, type Either } from "../../../../core/either";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionCommentRepository } from "../repositories/question-comment-repository";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";

interface ListQuestionCommentsUseCaseRequest {
  questionId: string;
  page: number;
}

type ListQuestionCommentsUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAuthor[];
  }
>;

@Injectable()
export class ListQuestionCommentsUseCase {
  constructor(private questionCommentRepository: QuestionCommentRepository) {}

  async execute({
    questionId,
    page,
  }: ListQuestionCommentsUseCaseRequest): Promise<ListQuestionCommentsUseCaseResponse> {
    const comments =
      await this.questionCommentRepository.findManyByQuestionIdWithAuthor(
      questionId,
      {
        page,
      }
    )

    return right({
      comments,
    });
  }
}
