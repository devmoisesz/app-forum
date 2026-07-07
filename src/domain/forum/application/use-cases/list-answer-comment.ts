import { Either, right } from "@/src/core/either";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerCommentRepository } from "../repositories/answer-comment-repository";
import { Injectable } from "@nestjs/common";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";


interface ListAnswerCommentsUseCaseRequest {
  answerId: string
  page: number
}
type ListAnswerCommentsUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAuthor[] 
  }
>

@Injectable()
export class ListAnswerCommentsUseCase {
  constructor(private answerCommentRepository: AnswerCommentRepository) {}

  async execute({
    answerId,
    page
  }: ListAnswerCommentsUseCaseRequest): Promise<ListAnswerCommentsUseCaseResponse> {
    const comments = await this.answerCommentRepository.findManyByAnswerIdWithAuthor(answerId, {page})

    return right({
      comments
    })
  }
}
