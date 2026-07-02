import { right, type Either } from "../../../../core/either";
import type { QuestionComment } from "../../enterprise/entities/question-comment";
import type { QuestionCommentRepository } from "../repositories/question-comment-repository";


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
