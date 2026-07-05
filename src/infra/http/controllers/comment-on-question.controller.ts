import { BadRequestException, Body, Controller, HttpCode, Param, Post } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipes } from "../pipes/zod-validation-pipe";
import { CurrentUser } from "../../auth/current-user-decorator";
import type { UserPayload } from "../../auth/jwt.strategy";
import { CommentOnQuestionUseCase } from "@/src/domain/forum/application/use-cases/comment-on-question";

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
});

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipes(commentOnQuestionBodySchema);

@Controller("/questions/:questionId/comments")
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CommentOnQuestionBodySchema,
    @Param('questionId') questionId: string
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnQuestion.execute({
      content,
      questionId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
