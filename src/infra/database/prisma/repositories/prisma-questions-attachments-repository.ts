import { QuestionAttachmentRepository } from "@/src/domain/forum/application/repositories/question-attchments-repository";
import { QuestionAttachment } from "@/src/domain/forum/enterprise/entities/question-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionAttachmentsMapper } from "../mappers/prisma-question-attachment-mapper";

@Injectable()
export class PrismaQuestionsAttachmentsRepository implements QuestionAttachmentRepository{
    constructor(private readonly prisma: PrismaService) {}

    async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
        const questionAttachments = await this.prisma.attachment.findMany({
            where: {
                questionId
            }
        }) 

        return questionAttachments.map(PrismaQuestionAttachmentsMapper.toDomain)
    }

    async deleteManyByQuestionId(questionId: string): Promise<void> {
        await this.prisma.attachment.deleteMany({
            where: {
                questionId
            }
        })
    }
}