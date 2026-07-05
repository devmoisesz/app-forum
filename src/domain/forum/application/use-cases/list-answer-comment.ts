import { Either, right } from "@/src/core/either";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerCommentRepository } from "../repositories/answer-comment-repository";
import { Injectable } from "@nestjs/common";


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

@Injectable()
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
