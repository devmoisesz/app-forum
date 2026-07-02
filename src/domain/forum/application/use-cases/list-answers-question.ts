import { Either, right } from "@/src/core/either";
import type { Answer } from "../../enterprise/entities/answer";
import type { AnswerRepository } from "../repositories/answers-repository";


interface ListAnswersOfQuestionUseCaseRequest {
  questionId: string
  page: number
}

type ListAnswersOfQuestionUseCaseResponse = Either<
  null,
  {
    answers: Answer[] 
  }
>

export class ListAnswersOfQuestionUseCase {
  constructor(private answersRepository: AnswerRepository) {}

  async execute({
    questionId,
    page
  }: ListAnswersOfQuestionUseCaseRequest): Promise<ListAnswersOfQuestionUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(questionId, {page})

    return right({
      answers
    })
  }
}
