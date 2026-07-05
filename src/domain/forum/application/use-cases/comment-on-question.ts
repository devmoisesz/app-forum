import { QuestionsRepository } from "../repositories/question-repository";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionCommentRepository } from "../repositories/question-comment-repository";
import { Either, left, right } from "@/src/core/either";
import { ResourceNotFoundError } from "@/src/core/error/errors/resource-not-found-error";
import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";


interface CommentOnQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  content: string;
}
type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment;
  }
>;

@Injectable()
export class CommentOnQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentRepository: QuestionCommentRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    });

    await this.questionCommentRepository.create(questionComment);

    return right({
      questionComment,
    });
  }
}
