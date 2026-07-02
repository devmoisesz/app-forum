import { right, type Either } from "../../../../core/either";
import { Question } from "../../enterprise/entities/question";
import type { QuestionsRepository } from "../repositories/question-repository";

interface ListRecentQuestionsUseCaseRequest {
  page: number
}

type ListRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[]
  }
>

export class ListRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page
  }: ListRecentQuestionsUseCaseRequest): Promise<ListRecentQuestionsUseCaseResponse> {
    const questions  = await this.questionsRepository.findManyRecent({ page })

    return right({
      questions
    })
  }
}
