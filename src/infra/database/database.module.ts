import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
import { PrismaQuestionsAttachmentsRepository } from "./prisma/repositories/prisma-questions-attachments-repository";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaAnswerRepoistory } from "./prisma/repositories/prisma-answers-repository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaAnswerCommentsRepoistory } from "./prisma/repositories/prisma-answer-comments-repository";
import { QuestionsRepository } from "@/src/domain/forum/application/repositories/question-repository";
import { StudentsRepository } from "@/src/domain/forum/application/repositories/students-repository";
import { PrismaStudentRepository } from "./prisma/repositories/prisma-students-repository";
import { QuestionCommentRepository } from "@/src/domain/forum/application/repositories/question-comment-repository";
import { QuestionAttachmentRepository } from "@/src/domain/forum/application/repositories/question-attchments-repository";
import { AnswerRepository } from "@/src/domain/forum/application/repositories/answers-repository";
import { AnswerCommentRepository } from "@/src/domain/forum/application/repositories/answer-comment-repository";
import { AnswerAttachmentRepository } from "@/src/domain/forum/application/repositories/answer-attchments-repository";
import { AttachmentsRepository } from "@/src/domain/forum/application/repositories/attachments-repository";
import { PrismaAttachmentRepository } from "./prisma/repositories/prisma-attachment-repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentRepository,
    },
    {
      provide: QuestionCommentRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: QuestionAttachmentRepository,
      useClass: PrismaQuestionsAttachmentsRepository,
    },
    {
      provide: AnswerRepository,
      useClass: PrismaAnswerRepoistory,
    },
    {
      provide: AnswerCommentRepository,
      useClass: PrismaAnswerCommentsRepoistory,
    },
    {
      provide: AnswerAttachmentRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentRepository
    }
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    StudentsRepository,
    QuestionCommentRepository,
    QuestionAttachmentRepository,
    AnswerRepository,
    AnswerCommentRepository,
    AnswerAttachmentRepository,
    AttachmentsRepository
  ],
})
export class DatabaseModule {}
