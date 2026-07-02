import { AnswerAttachmentRepository } from "@/src/domain/forum/application/repositories/answer-attchments-repository"
import { AnswerAttachment } from "@/src/domain/forum/enterprise/entities/answer-attachment"


export class InMemoryAnswerAttachmentRepository implements AnswerAttachmentRepository {
    public items: AnswerAttachment[] = []

    async deleteManyByAnswerId(answerId: string) {
        const answerAttachments = this.items.filter(
            (item) => item.answerId.toString() != answerId
        )
        
        this.items = answerAttachments
    }

    async findManyByAnswerId(answerId: string) {
        const answerAttachments = this.items.filter(
            (item) => item.answerId.toString() === answerId
        )
        
        return answerAttachments
    }
}