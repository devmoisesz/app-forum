import { BadRequestException, Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipes } from "../pipes/zod-validation-pipe";
import { ListAnswerCommentsUseCase } from "@/src/domain/forum/application/use-cases/list-answer-comment";
import { CommentPresenter } from "../presenters/comment-presenter";
import { CommentWithAuthor } from "@/src/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { CommentWithAuthorPresenter } from "../presenters/comment-with-author-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipes(pageQueryParamSchema)

@Controller("/answers/:answerId/comments")
export class ListAnswerCommentsController {
  constructor(private listAnswerComments: ListAnswerCommentsUseCase) {}

  @Get()
  async handle(@Query(
    "page", queryValidationPipe) page: PageQueryParamSchema,
    @Param('answerId') answerId: string
  ) {
    const result  = await this.listAnswerComments.execute({
      page,
      answerId
    })

    if(result.isLeft()){
      throw new BadRequestException()
    }

    const comments = result.value.comments

    return { comments: comments.map(CommentWithAuthorPresenter.toHTTP)}
  }
}
