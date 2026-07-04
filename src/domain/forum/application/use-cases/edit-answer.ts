import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepository } from "../repositories/answers-repository";
import { AnswerAttachmentList } from "../../../forum/enterprise/entities/answer-attachment-list";
import { AnswerAttachmentRepository } from "../repositories/answer-attchments-repository";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { NotAllowedError } from "@/src/core/error/errors/not-allowed-error";
import { Either, left, right } from "@/src/core/either";
import { ResourceNotFoundError } from "@/src/core/error/errors/resource-not-found-error";
import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";

interface EditAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
  attachmentsIds: string[];
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer;
  }
>;

export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswerRepository,
    private answerAttachmentsRepository: AnswerAttachmentRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId != answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId);

    const answerAttachmentsList = new AnswerAttachmentList(
      currentAnswerAttachments,
    );

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      });
    });

    answerAttachmentsList.update(answerAttachments);

    answer.attachments = answerAttachmentsList;
    answer.content = content;

    await this.answersRepository.save(answer);

    return right({
      answer,
    });
  }
}
