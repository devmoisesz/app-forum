import { Either, left, right } from "@/src/core/either";
import { QuestionsRepository } from "../repositories/question-repository";
import { NotAllowedError } from "@/src/core/error/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/src/core/error/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

interface DeleteQuestionUseCaseRequest {
  questionId: string;
  authorId: string;
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId != question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.questionsRepository.delete(question);

    return right(null);
  }
}
