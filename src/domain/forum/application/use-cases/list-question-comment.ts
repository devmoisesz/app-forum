import { Injectable } from "@nestjs/common";
import { right, type Either } from "../../../../core/either";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionCommentRepository } from "../repositories/question-comment-repository";


interface ListQuestionCommentsUseCaseRequest {
  questionId: string
  page: number
}

type ListQuestionCommentsUseCaseResponse = Either <
  null,
  {
    questionComments: QuestionComment[] 
  }
>

@Injectable()
export class ListQuestionCommentsUseCase {
  constructor(private questionCommentRepository: QuestionCommentRepository) {}

  async execute({
    questionId,
    page
  }: ListQuestionCommentsUseCaseRequest): Promise<ListQuestionCommentsUseCaseResponse> {
    const questionComments = await this.questionCommentRepository.findManyByQuestionId(questionId, {page})

    return right({
      questionComments
    })
  }
}
