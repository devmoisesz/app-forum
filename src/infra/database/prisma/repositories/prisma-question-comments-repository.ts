import { PaginationParams } from "@/src/core/repositories/pagination-params";
import { QuestionCommentRepository } from "@/src/domain/forum/application/repositories/question-comment-repository";
import { QuestionComment } from "@/src/domain/forum/enterprise/entities/question-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentRepository{
    constructor(private readonly prisma: PrismaService) {}
    
    findById(id: string): Promise<QuestionComment | null> {
        throw new Error("Method not implemented.");
    }
    findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]> {
        throw new Error("Method not implemented.");
    }
    create(questionComment: QuestionComment): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(questionComment: QuestionComment): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}