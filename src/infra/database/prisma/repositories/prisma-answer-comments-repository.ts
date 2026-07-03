import { PaginationParams } from "@/src/core/repositories/pagination-params";
import { AnswerCommentRepository } from "@/src/domain/forum/application/repositories/answer-comment-repository";
import { AnswerComment } from "@/src/domain/forum/enterprise/entities/answer-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaAnswerCommentsRepoistory implements AnswerCommentRepository{
    constructor(private readonly prisma: PrismaService) {}
    
    findById(id: string): Promise<AnswerComment | null> {
        throw new Error("Method not implemented.");
    }
    findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]> {
        throw new Error("Method not implemented.");
    }
    create(answerComment: AnswerComment): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(answerComment: AnswerComment): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}