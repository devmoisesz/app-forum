import { PaginationParams } from "@/src/core/repositories/pagination-params";
import { AnswerRepository } from "@/src/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/src/domain/forum/enterprise/entities/answer";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaAnswerRepoistory implements AnswerRepository {
    constructor(private readonly prisma: PrismaService) {}
    
    create(answer: Answer): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(answer: Answer): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<Answer | null> {
        throw new Error("Method not implemented.");
    }
    findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]> {
        throw new Error("Method not implemented.");
    }
    save(answer: Answer): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}