import { InMemoryQuestionCommentRepository } from "@/test/repositories-in-memory/in-memory-question-comment-repository";
import { ListQuestionCommentsUseCase } from "./list-question-comment";
import { makeQuestionComment } from "@/test/factories/make-question-comment";
import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";
import { InMemoryStudentRepository } from "@/test/repositories-in-memory/in-memory-student-repository";
import { makeStudent } from "@/test/factories/make-student";

let questionCommentRepository: InMemoryQuestionCommentRepository;
let listQuestionCommentsUseCase: ListQuestionCommentsUseCase;
let studentRepository: InMemoryStudentRepository;

describe("List QuestionComment of Question", () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository();
    questionCommentRepository = new InMemoryQuestionCommentRepository(
      studentRepository,
    );
    listQuestionCommentsUseCase = new ListQuestionCommentsUseCase(
      questionCommentRepository,
    );
  });

  it("should be able to list question comments", async () => {
    const student = makeStudent({ name: "John doe" });

    studentRepository.items.push(student);

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID("1"),
      authorId: student.id,
    });

    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID("1"),
      authorId: student.id,
    });

    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityID("1"),
      authorId: student.id,
    });

    await questionCommentRepository.create(comment1);
    await questionCommentRepository.create(comment2);
    await questionCommentRepository.create(comment3);

    const result = await listQuestionCommentsUseCase.execute({
      questionId: "1",
      page: 1,
    });

    expect(result.value?.comments).toHaveLength(3);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: "John doe",
          commentId: comment1.id
        }),
        expect.objectContaining({
          author: "John doe",
          commentId: comment2.id
        }),
        expect.objectContaining({
          author: "John doe",
          commentId: comment3.id
        }),
      ]),
    );
  });

  it("should be able to fetch paginated question comments", async () => {
    const student = makeStudent({ name: "John doe" });

    studentRepository.items.push(student);

    for (let i = 1; i <= 22; i++) {
      await questionCommentRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID("1"),
          authorId: student.id
        }),
      );
    }

    const result = await listQuestionCommentsUseCase.execute({
      questionId: "1",
      page: 2,
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
