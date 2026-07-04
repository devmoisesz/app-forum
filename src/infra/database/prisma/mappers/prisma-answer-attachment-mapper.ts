import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";
import { AnswerAttachment } from "@/src/domain/forum/enterprise/entities/answer-attachment";
import { Attachment as PrismaAttachment, Prisma } from "@prisma/client";

export class PrismaAnswerAttachmentsMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if(!raw.answerId){
        throw new Error('Invalid attachment type')
    }

    return AnswerAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        answerId: new UniqueEntityID(raw.answerId),
      },
      new UniqueEntityID(raw.id),
    );
  }
}
