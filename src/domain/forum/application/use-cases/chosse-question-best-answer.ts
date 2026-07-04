import { AnswerRepository } from "../repositories/answers-repository";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/question-repository";
import { Either, left, right } from "@/src/core/either";
import { NotAllowedError } from "@/src/core/error/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/src/core/error/errors/resource-not-found-error";


interface ChosseQuestionBestAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
}
type ChosseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

export class ChosseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswerRepository,
  ) {}

  async execute({
    authorId,
    answerId,
  }: ChosseQuestionBestAnswerUseCaseRequest): Promise<ChosseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    );

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId != question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    question.bestAnswerId = answer.id;

    await this.questionsRepository.save(question);

    return right({
      question,
    });
  }
}
