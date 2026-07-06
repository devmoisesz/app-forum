import { BadRequestException, Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipes } from "../pipes/zod-validation-pipe";
import { ListQuestionCommentsUseCase } from "@/src/domain/forum/application/use-cases/list-question-comment";
import { CommentWithAuthorPresenter } from "../presenters/comment-with-author-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipes(pageQueryParamSchema)

@Controller("/questions/:questionId/comments")
export class ListQuestionCommentsController {
  constructor(private listQuestionComments: ListQuestionCommentsUseCase) {}

  @Get()
  async handle(@Query(
    "page", queryValidationPipe) page: PageQueryParamSchema,
    @Param('questionId') questionId: string
  ) {
    const result  = await this.listQuestionComments.execute({
      page,
      questionId
    })

    if(result.isLeft()){
      throw new BadRequestException()
    }

    const questionComments = result.value.comments

    return { comments: questionComments.map(CommentWithAuthorPresenter.toHTTP)}
  }
}
