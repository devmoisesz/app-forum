import {
  Body,
  Controller,
  Post,
  UseGuards,
} from "@nestjs/common";
import z from "zod";
import { ZodValidationPipes } from "../pipes/zod-validation-pipe";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { CurrentUser } from "../../auth/current-user-decorator";
import { Slug } from "../../types/slug";
import type { UserPayload } from "../../auth/jwt.strategy";


const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipes(createQuestionBodySchema)

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(
    private prisma: PrismaService
  ) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema
  ) {
    const { title, content } = body
    const userId = user.sub

    const slug = Slug.createFromText(title)

    await this.prisma.question.create({
        data: {
            authorId: userId,
            title,
            content,
            slug,
        }
    })
  }
}
