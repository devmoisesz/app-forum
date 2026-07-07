
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { InMemoryQuestionRepository } from "@/test/repositories-in-memory/in-memory-questions-repository";
import { InMemoryQuestionCommentRepository } from "@/test/repositories-in-memory/in-memory-question-comment-repository";
import { makeQuestion } from "@/test/factories/make-question";
import { InMemoryQuestionAttachmentRepository } from "@/test/repositories-in-memory/in-memory-question-attachments-repository";
import { InMemoryAttachmentRepository } from "@/test/repositories-in-memory/in-memory-attachments-repository";
import { InMemoryStudentRepository } from "@/test/repositories-in-memory/in-memory-student-repository";

let questionsRepository: InMemoryQuestionRepository;
let questionCommentRepository: InMemoryQuestionCommentRepository;
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let commentOnQuestionUseCase: CommentOnQuestionUseCase
let attachmentsRepository: InMemoryAttachmentRepository;
let studentRepository: InMemoryStudentRepository

describe("Comment on question", () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
    attachmentsRepository = new InMemoryAttachmentRepository()
    studentRepository = new InMemoryStudentRepository()
    questionsRepository = new InMemoryQuestionRepository(
      questionAttachmentRepository,
      attachmentsRepository,
      studentRepository
    );
    questionCommentRepository = new InMemoryQuestionCommentRepository(studentRepository);

    commentOnQuestionUseCase = new CommentOnQuestionUseCase(
      questionsRepository,
      questionCommentRepository,
    );
  });

  it("should be able to comment on question", async () => {
    const question = makeQuestion();

    await questionsRepository.create(question);

    await commentOnQuestionUseCase.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: "Comment top",
    });

    expect(questionCommentRepository.items[0]?.content).toEqual("Comment top");
  });
});
