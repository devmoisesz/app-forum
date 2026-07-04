import { PaginationParams } from "@/src/core/repositories/pagination-params";
import { QuestionCommentRepository } from "@/src/domain/forum/application/repositories/question-comment-repository";
import { QuestionComment } from "@/src/domain/forum/enterprise/entities/question-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionCommentMapper } from "../mappers/prisma-question-comment-mapper";

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const question = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!question) return null;

    return PrismaQuestionCommentMapper.toDomain(question);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = await this.prisma.comment.findMany({
      where: {
        questionId
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return questionComments.map(PrismaQuestionCommentMapper.toDomain);
  }

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment);

    await this.prisma.comment.create({
      data,
    });
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: questionComment.id.toString(),
      },
    });
  }
}
