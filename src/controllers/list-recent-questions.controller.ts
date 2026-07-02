import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PrismaService } from "../prisma/prisma.service";
import z, { number } from "zod";
import { ZodValidationPipes } from "../pipes/zod-validation-pipe";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipes(pageQueryParamSchema)

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class ListRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query("page", queryValidationPipe) page: PageQueryParamSchema) {
    const questions = await this.prisma.question.findMany({
      take: 1,
      skip: (page -1) * 1,
      orderBy: {
        createdAt: "desc",
      },
    });

    return { questions };
  }
}
