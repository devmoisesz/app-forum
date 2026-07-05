import { PaginationParams } from "@/src/core/repositories/pagination-params";
import type { AnswerComment } from "../../enterprise/entities/answer-comment";

export abstract class AnswerCommentRepository {
    abstract findById(id: string): Promise<AnswerComment | null>
    abstract findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]>
    abstract create(answerComment: AnswerComment): Promise<void>
    abstract delete(answerComment: AnswerComment): Promise<void>
}