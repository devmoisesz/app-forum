import { AnswerAttachmentRepository } from "@/src/domain/forum/application/repositories/answer-attchments-repository";
import { AnswerAttachment } from "@/src/domain/forum/enterprise/entities/answer-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentRepository {
    constructor(private readonly prisma: PrismaService) {}
    
    findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
        throw new Error("Method not implemented.");
    }
    deleteManyByAnswerId(answerId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}