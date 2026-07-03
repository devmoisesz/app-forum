import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
import { PrismaQuestionsAttachmentsRepository } from "./prisma/repositories/prisma-questions-attachments-repository";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaAnswerRepoistory } from "./prisma/repositories/prisma-answers-repository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaAnswerCommentsRepoistory } from "./prisma/repositories/prisma-answer-comments-repository";
import { QuestionsRepository } from "@/src/domain/forum/application/repositories/question-repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository
    },
    PrismaQuestionCommentsRepository,
    PrismaQuestionsAttachmentsRepository,
    PrismaAnswerRepoistory,
    PrismaAnswerCommentsRepoistory,
    PrismaAnswerAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionsAttachmentsRepository,
    PrismaAnswerRepoistory,
    PrismaAnswerCommentsRepoistory,
    PrismaAnswerAttachmentsRepository,
],
})
export class DatabaseModule {}
