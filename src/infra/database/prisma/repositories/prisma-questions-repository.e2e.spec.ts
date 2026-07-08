import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { StudentFactory } from "@/test/factories/make-student";
import { QuestionFactory } from "@/test/factories/make-question";
import { AttachmentFactory } from "@/test/factories/make-attachment";
import { QuestionAttachmentFactory } from "@/test/factories/make-question-attachment";
import { DatabaseModule } from "../../database.module";
import { AppModule } from "@/src/infra/app.module";
import { CacheRepository } from "@/src/infra/cache/cache-repository";
import { CacheModule } from "@/src/infra/cache/cache.module";
import { QuestionsRepository } from "@/src/domain/forum/application/repositories/question-repository";

describe("Prisma Questions Repository (E2E)", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let questionsRepository: QuestionsRepository;
  let cache: CacheRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
    questionsRepository = moduleRef.get(QuestionsRepository);
    cache = moduleRef.get(CacheRepository);

    await app.init();
  });

  it("should cache question details", async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    const questionDetails = await questionsRepository.findDetailsBySlug(slug);

    const cached = await cache.get(`question:${slug}:details`);

    if(!cached){
      throw new Error()
    }

    expect(JSON.parse(cached)).toEqual(expect.objectContaining({
      id: questionDetails?.questionId.toString()
    }));
  });

  it("should return cached question details on subsequent calls", async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;
    
    let cached = await cache.get(`question:${slug}:details`);

    expect(cached).toBeNull()

    await questionsRepository.findDetailsBySlug(slug);

    cached = await cache.get(`question:${slug}:details`);

    expect(cached).not.toBeNull()

    if(!cached){
      throw new Error()
    }

    const questionDetails = await questionsRepository.findDetailsBySlug(slug);

    expect(JSON.parse(cached)).toEqual(expect.objectContaining({
      id: questionDetails?.questionId.toString()
    }));
  });

  it("should reset question details cache when saving the question", async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    await cache.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    );

    await questionsRepository.save(question)

    const cached = await cache.get(`question:${slug}:details`);

    expect(cached).toBeNull()
  });
});
