import { MockInstance } from "vitest";
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from "../use-cases/send-notification";
import { InMemoryAnswerAttachmentRepository } from "@/test/repositories-in-memory/in-memory-answer-attachments-repository";
import { InMemoryAnswerCommentRepository } from "@/test/repositories-in-memory/in-memory-answer-comment-repository";
import { InMemoryQuestionAttachmentRepository } from "@/test/repositories-in-memory/in-memory-question-attachments-repository";
import { InMemoryAnswerRepository } from "@/test/repositories-in-memory/in-memory-answers-repository";
import { InMemoryQuestionRepository } from "@/test/repositories-in-memory/in-memory-questions-repository";
import { InMemoryNotificationRepository } from "@/test/repositories-in-memory/in-memory-notification-repository";
import { OnAnswerCommentCreated } from "./on-answer-comment-created";
import { makeQuestion } from "@/test/factories/make-question";
import { makeAnswer } from "@/test/factories/make-answer";
import { makeAnswerComment } from "@/test/factories/make-answer-comment";
import { waitFor } from "@/test/utils/wait-for";
import { InMemoryStudentRepository } from "@/test/repositories-in-memory/in-memory-student-repository";
import { InMemoryAttachmentRepository } from "@/test/repositories-in-memory/in-memory-attachments-repository";

let answersRepository: InMemoryAnswerRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentRepository;
let answerCommentRepository: InMemoryAnswerCommentRepository;
let questionsAttachmentsRepository: InMemoryQuestionAttachmentRepository;
let questionRepository: InMemoryQuestionRepository;
let notificationRepository: InMemoryNotificationRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let attachmentsRepository: InMemoryAttachmentRepository;
let studentRepository: InMemoryStudentRepository;

let sendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>;

describe("On Answer Comment Created", () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentRepository();
    answersRepository = new InMemoryAnswerRepository(
      answerAttachmentsRepository,
    );
    studentRepository = new InMemoryStudentRepository();
    answerCommentRepository = new InMemoryAnswerCommentRepository(
      studentRepository,
    );
    questionsAttachmentsRepository = new InMemoryQuestionAttachmentRepository();
    attachmentsRepository = new InMemoryAttachmentRepository();
    questionRepository = new InMemoryQuestionRepository(
      questionsAttachmentsRepository,
      attachmentsRepository,
      studentRepository,
    );
    notificationRepository = new InMemoryNotificationRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      notificationRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

    new OnAnswerCommentCreated(
      answerCommentRepository,
      answersRepository,
      sendNotificationUseCase,
    );
  });
  it("should send a notification when an answer receives a comment", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });
    const answerComment = makeAnswerComment({ answerId: answer.id });

    questionRepository.create(question);
    answersRepository.create(answer);
    answerCommentRepository.create(answerComment);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
