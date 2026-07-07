import { InMemoryQuestionRepository } from "../../../../../test/repositories-in-memory/in-memory-questions-repository";
import { InMemoryAnswerRepository } from "../../../../../test/repositories-in-memory/in-memory-answers-repository";
import { makeAnswer } from "../../../../../test/factories/make-answer";
import { makeQuestion } from "../../../../../test/factories/make-question";
import { NotAllowedError } from "@/src/core/error/errors/not-allowed-error";
import { InMemoryQuestionAttachmentRepository } from "../../../../../test/repositories-in-memory/in-memory-question-attachments-repository";
import { InMemoryAnswerAttachmentRepository } from "../../../../../test/repositories-in-memory/in-memory-answer-attachments-repository";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { InMemoryAttachmentRepository } from "@/test/repositories-in-memory/in-memory-attachments-repository";
import { InMemoryStudentRepository } from "@/test/repositories-in-memory/in-memory-student-repository";

let answersAttachmentsRepository: InMemoryAnswerAttachmentRepository;
let questionsRepository: InMemoryQuestionRepository;
let answerRepository: InMemoryAnswerRepository;
let attachmentRepository: InMemoryAttachmentRepository
let studentRepository: InMemoryStudentRepository
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let chooseQuestionBestAnswerUseCase: ChooseQuestionBestAnswerUseCase;

describe("Chosse Question Best Answer", () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
    attachmentRepository = new InMemoryAttachmentRepository()
    studentRepository = new InMemoryStudentRepository()
    questionsRepository = new InMemoryQuestionRepository(
      questionAttachmentRepository,
      attachmentRepository,
      studentRepository
    );
    answersAttachmentsRepository = new InMemoryAnswerAttachmentRepository();
    answerRepository = new InMemoryAnswerRepository(
      answersAttachmentsRepository,
    );

    chooseQuestionBestAnswerUseCase = new ChooseQuestionBestAnswerUseCase(
      questionsRepository,
      answerRepository,
    );
  });

  it("should be able to chosse the question best answer", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id,
    });

    await questionsRepository.create(question);
    await answerRepository.create(answer);

    await chooseQuestionBestAnswerUseCase.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    expect(questionsRepository.items[0]?.bestAnswerId).toEqual(answer.id);
  });

  it("should not be able to chosse another user question best answer", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id,
    });

    await questionsRepository.create(question);
    await answerRepository.create(answer);

    const result = await chooseQuestionBestAnswerUseCase.execute({
      answerId: answer.id.toString(),
      authorId: "author-2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
