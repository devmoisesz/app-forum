
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { InMemoryQuestionRepository } from "@/test/repositories-in-memory/in-memory-questions-repository";
import { InMemoryQuestionCommentRepository } from "@/test/repositories-in-memory/in-memory-question-comment-repository";
import { makeQuestion } from "@/test/factories/make-question";
import { InMemoryQuestionAttachmentRepository } from "@/test/repositories-in-memory/in-memory-question-attachments-repository";

let questionsRepository: InMemoryQuestionRepository;
let questionCommentRepository: InMemoryQuestionCommentRepository;
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let commentOnQuestionUseCase: CommentOnQuestionUseCase;

describe("Comment on question", () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
    questionsRepository = new InMemoryQuestionRepository(
      questionAttachmentRepository,
    );
    questionCommentRepository = new InMemoryQuestionCommentRepository();

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
