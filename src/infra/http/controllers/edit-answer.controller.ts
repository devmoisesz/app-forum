import { BadRequestException, Body, Controller, HttpCode, Param, Put } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipes } from "../pipes/zod-validation-pipe";
import { CurrentUser } from "../../auth/current-user-decorator";
import type { UserPayload } from "../../auth/jwt.strategy";
import { EditAnswerUseCase } from "@/src/domain/forum/application/use-cases/edit-answer";

const editAnswerBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid())
});

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

const bodyValidationPipe = new ZodValidationPipes(editAnswerBodySchema);

@Controller("/answers/:id")
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
      @Body(bodyValidationPipe) body: EditAnswerBodySchema,
      @CurrentUser() user: UserPayload,
      @Param('id') answerId: string
  ) {
    const { content, attachments } = body;
    const userId = user.sub;

    const result = await this.editAnswer.execute({
      content,
      authorId: userId,
      attachmentsIds: attachments,
      answerId
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
