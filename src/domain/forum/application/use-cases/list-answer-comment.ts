import { Either, right } from "@/src/core/either";
import type { AnswerComment } from "../../enterprise/entities/answer-comment";
import type { AnswerCommentRepository } from "../repositories/answer-comment-repository";


interface ListAnswerCommentsUseCaseRequest {
  answerId: string
  page: number
}
type ListAnswerCommentsUseCaseResponse = Either<
  null,
  {
    answerComments: AnswerComment[] 
  }
>

export class ListAnswerCommentsUseCase {
  constructor(private answerCommentRepository: AnswerCommentRepository) {}

  async execute({
    answerId,
    page
  }: ListAnswerCommentsUseCaseRequest): Promise<ListAnswerCommentsUseCaseResponse> {
    const answerComments = await this.answerCommentRepository.findManyByAnswerId(answerId, {page})

    return right({
      answerComments
    })
  }
}
