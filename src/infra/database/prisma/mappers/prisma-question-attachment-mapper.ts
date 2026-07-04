import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";
import { QuestionAttachment } from "@/src/domain/forum/enterprise/entities/question-attachment";
import { Attachment as PrismaAttachment, Prisma } from "@prisma/client";

export class PrismaQuestionAttachmentsMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if(!raw.questionId){
        throw new Error('Invalid attachment type')
    }

    return QuestionAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        questionId: new UniqueEntityID(raw.questionId),
      },
      new UniqueEntityID(raw.id),
    );
  }
}
