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

    async createMany(attachments: AnswerAttachment[]): Promise<void> {
        this.items.push(...attachments);
      }
    
      async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
        const answerAttachments = this.items.filter((item) => {
            return !attachments.some((attachment) => attachment.equals(item))
        })
    
        this.items = answerAttachments
      }
}