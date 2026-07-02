import { InMemoryQuestionAttachmentRepository } from "@/test/repositories-in-memory/in-memory-question-attachments-repository";
import { ListRecentQuestionsUseCase } from "./list-recent-questions";
import { InMemoryQuestionRepository } from "@/test/repositories-in-memory/in-memory-questions-repository";
import { makeQuestion } from "@/test/factories/make-question";

let questionsRepository: InMemoryQuestionRepository;
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let listRecentQuestionsUseCase: ListRecentQuestionsUseCase;

describe("List Recent Questions", () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
    questionsRepository = new InMemoryQuestionRepository(
      questionAttachmentRepository,
    );
    listRecentQuestionsUseCase = new ListRecentQuestionsUseCase(
      questionsRepository,
    );
  });

  it("should be able to fetch recent questions", async () => {
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 20) }),
    );
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 18) }),
    );
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 23) }),
    );

    const result = await listRecentQuestionsUseCase.execute({
      page: 1,
    });

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ]);
  });

  it("should be able to fetch paginated recent questions", async () => {
    for (let i = 1; i <= 22; i++) {
      await questionsRepository.create(makeQuestion());
    }

    const result = await listRecentQuestionsUseCase.execute({
      page: 2,
    });

    expect(result.value?.questions).toHaveLength(2);
  });
});
