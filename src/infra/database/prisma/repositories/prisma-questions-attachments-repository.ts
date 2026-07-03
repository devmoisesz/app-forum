import { QuestionAttachmentRepository } from "@/src/domain/forum/application/repositories/question-attchments-repository";
import { QuestionAttachment } from "@/src/domain/forum/enterprise/entities/question-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaQuestionsAttachmentsRepository implements QuestionAttachmentRepository{
    constructor(private readonly prisma: PrismaService) {}

    findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
        throw new Error("Method not implemented.");
    }
    deleteManyByQuestionId(questionId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}