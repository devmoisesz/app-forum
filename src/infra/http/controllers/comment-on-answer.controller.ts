import { BadRequestException, Body, Controller, HttpCode, Param, Post } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipes } from "../pipes/zod-validation-pipe";
import { CurrentUser } from "../../auth/current-user-decorator";
import type { UserPayload } from "../../auth/jwt.strategy";
import { CommentOnAnswerUseCase } from "@/src/domain/forum/application/use-cases/comment-on-answer";

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
});

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>;

const bodyValidationPipe = new ZodValidationPipes(commentOnAnswerBodySchema);

@Controller("/answers/:answerId/comments")
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
    @Param('answerId') answerId: string
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnAnswer.execute({
      content,
      answerId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
