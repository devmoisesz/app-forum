import { InMemoryAnswerCommentRepository } from "@/test/repositories-in-memory/in-memory-answer-comment-repository";
import { ListAnswerCommentsUseCase } from "./list-answer-comment";
import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";
import { makeAnswerComment } from "@/test/factories/make-answer-comment";
import { InMemoryStudentRepository } from "@/test/repositories-in-memory/in-memory-student-repository";
import { makeStudent } from "@/test/factories/make-student";

let answerCommentRepository: InMemoryAnswerCommentRepository;
let studentRepository: InMemoryStudentRepository;
let listAnswerCommentsUseCase: ListAnswerCommentsUseCase;

describe("List AnswerComment of Answer", () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository();
    answerCommentRepository = new InMemoryAnswerCommentRepository(
      studentRepository,
    );
    listAnswerCommentsUseCase = new ListAnswerCommentsUseCase(
      answerCommentRepository,
    );
  });

  it("should be able to list answer comments", async () => {
    const student = makeStudent({ name: "John doe" });

    studentRepository.items.push(student);

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID("1"),
      authorId: student.id,
    });

    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID("1"),
      authorId: student.id,
    });

    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID("1"),
      authorId: student.id,
    });

    await answerCommentRepository.create(comment1);
    await answerCommentRepository.create(comment2);
    await answerCommentRepository.create(comment3);

    const result = await listAnswerCommentsUseCase.execute({
      answerId: "1",
      page: 1,
    });

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John doe',
          commentId: comment1.id
        }),
        expect.objectContaining({
          author: 'John doe',
          commentId: comment2.id
        }),
        expect.objectContaining({
          author: 'John doe',
          commentId: comment3.id
        }),
      ])
    )
  });

  it("should be able to fetch paginated answer comments", async () => {
    const student = makeStudent({ name: "John doe" });

    studentRepository.items.push(student);

    for (let i = 1; i <= 22; i++) {
      await answerCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID("1"),
          authorId: student.id
        }),
      );
    }

    const result = await listAnswerCommentsUseCase.execute({
      answerId: "1",
      page: 2,
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
