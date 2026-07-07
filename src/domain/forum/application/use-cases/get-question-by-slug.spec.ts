import { GetQuestionBySlugUseCase } from "./get-question-by-slug";

import { Slug } from "../../enterprise/entities/value-objects/slug";
import { InMemoryQuestionRepository } from "@/test/repositories-in-memory/in-memory-questions-repository";
import { InMemoryQuestionAttachmentRepository } from "@/test/repositories-in-memory/in-memory-question-attachments-repository";
import { makeQuestion } from "@/test/factories/make-question";
import { InMemoryAttachmentRepository } from "@/test/repositories-in-memory/in-memory-attachments-repository";
import { InMemoryStudentRepository } from "@/test/repositories-in-memory/in-memory-student-repository";
import { makeStudent } from "@/test/factories/make-student";
import { makeAttachment } from "@/test/factories/make-attachment";
import { makeQuestionAttachment } from "@/test/factories/make-question-attachment";

let questionsRepository: InMemoryQuestionRepository;
let attachmentsRepository: InMemoryAttachmentRepository
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let studentRepository: InMemoryStudentRepository
let getQuestionBySlugUseCase: GetQuestionBySlugUseCase;

describe("Get question by slug", () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
    attachmentsRepository = new InMemoryAttachmentRepository()
    studentRepository = new InMemoryStudentRepository()
    questionsRepository = new InMemoryQuestionRepository(
      questionAttachmentRepository,
      attachmentsRepository,
      studentRepository
    );
    getQuestionBySlugUseCase = new GetQuestionBySlugUseCase(
      questionsRepository,
    );
  });

  it("should be able to get a question by slug", async () => {
    const student = makeStudent({ name: 'John doe' })

    studentRepository.items.push(student)

    const newQuestion = makeQuestion({
      authorId: student.id ,
      slug: Slug.create("question-example"),
    });

    questionsRepository.create(newQuestion);

    const attachment = makeAttachment({
      title: 'new attachment'
    })

    attachmentsRepository.items.push(attachment)

    questionAttachmentRepository.items.push(
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: newQuestion.id
      })
    )

    const result = await getQuestionBySlugUseCase.execute({
      slug: "question-example",
    });

   expect(result.value).toMatchObject({
    question: expect.objectContaining({
      title: newQuestion.title,
      author: 'John doe',
      attachments: [
        expect.objectContaining({
          title: 'new attachment'
        })
      ],
    })
   })
  });
});
