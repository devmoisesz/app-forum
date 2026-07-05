import { BadRequestException, Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipes } from "../pipes/zod-validation-pipe";
import { ListAnswersOfQuestionUseCase } from "@/src/domain/forum/application/use-cases/list-answers-question";
import { QuestionPresenter } from "../presenters/question-presenter";
import { AnswerPresenter } from "../presenters/answer-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipes(pageQueryParamSchema)

@Controller("/questions/:questionId/answers")
export class ListAnswersOfQuestionController {
  constructor(private listQuestionAnswers: ListAnswersOfQuestionUseCase) {}

  @Get()
  async handle(@Query(
    "page", queryValidationPipe) page: PageQueryParamSchema,
    @Param('questionId') questionId: string
  ) {
    const result  = await this.listQuestionAnswers.execute({
      page,
      questionId
    })

    if(result.isLeft()){
      throw new BadRequestException()
    }

    const answers = result.value.answers

    return { answers: answers.map(AnswerPresenter.toHTTP)}
  }
}
