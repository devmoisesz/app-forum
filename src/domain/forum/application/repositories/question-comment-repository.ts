import { PaginationParams } from "@/src/core/repositories/pagination-params"
import type { QuestionComment } from "../../enterprise/entities/question-comment";

export abstract class QuestionCommentRepository {
    abstract findById(id: string): Promise<QuestionComment | null>
    abstract findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]>
    abstract create(questionComment: QuestionComment): Promise<void>
    abstract delete(questionComment: QuestionComment): Promise<void>
}