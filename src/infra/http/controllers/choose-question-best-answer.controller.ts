import { BadRequestException, Body, Controller, HttpCode, Param, Patch, Put } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipes } from "../pipes/zod-validation-pipe";
import { CurrentUser } from "../../auth/current-user-decorator";
import type { UserPayload } from "../../auth/jwt.strategy";
import { ChooseQuestionBestAnswerUseCase } from "@/src/domain/forum/application/use-cases/choose-question-best-answer";

@Controller("/answers/:answerId/choose-as-best")
export class ChooseQuestionBestAnswerController {
  constructor(private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
      @CurrentUser() user: UserPayload,
      @Param('answerId') answerId: string
  ) {
    const userId = user.sub;

    const result = await this.chooseQuestionBestAnswer.execute({
      authorId: userId,
      answerId
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
