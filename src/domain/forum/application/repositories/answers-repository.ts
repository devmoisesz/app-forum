import { PaginationParams } from "@/src/core/repositories/pagination-params"
import { Answer } from "../../enterprise/entities/answer"


export interface AnswerRepository {
  create(answer: Answer): Promise<void>
  delete(answer: Answer): Promise<void>
  findById(id: string): Promise<Answer | null>
  findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]>
  save(answer: Answer): Promise<void>
}
