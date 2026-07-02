import { QuestionAttachmentRepository } from "@/src/domain/forum/application/repositories/question-attchments-repository"
import { QuestionAttachment } from "@/src/domain/forum/enterprise/entities/question-attachment"

export class InMemoryQuestionAttachmentRepository implements QuestionAttachmentRepository {
    public items: QuestionAttachment[] = []

    async deleteManyByQuestionId(questionId: string) {
        const questionAttachments = this.items.filter(
            (item) => item.questionId.toString() != questionId
        )
        
        this.items = questionAttachments
    }

    async findManyByQuestionId(questionId: string) {
        const questionAttachments = this.items.filter(
            (item) => item.questionId.toString() === questionId
        )
        
        return questionAttachments
    }
}