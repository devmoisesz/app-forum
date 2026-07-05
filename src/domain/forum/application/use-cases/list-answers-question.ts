import { Either, right } from "@/src/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepository } from "../repositories/answers-repository";
import { Injectable } from "@nestjs/common";


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

@Injectable()
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
