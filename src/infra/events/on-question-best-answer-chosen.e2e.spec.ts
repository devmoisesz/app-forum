import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { StudentFactory } from "@/test/factories/make-student";
import { QuestionFactory } from "@/test/factories/make-question";
import { AnswerFactory } from "@/test/factories/make-answer";
import { PrismaService } from "../database/prisma/prisma.service";
import { DatabaseModule } from "../database/database.module";
import { AppModule } from "../app.module";
import { waitFor } from "@/test/utils/wait-for";
import { DomainEvents } from "@/src/core/events/domain-events";

describe("On question best answer chosen (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let studentFactory: StudentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    prisma = moduleRef.get(PrismaService);
    answerFactory = moduleRef.get(AnswerFactory);

    DomainEvents.shouldRun = true

    await app.init();
  });

  it("should send a notification when question best answer is chosen", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    });

    const answerId = answer.id.toString();

    await request(app.getHttpServer())
      .patch(`/answers/${answerId}/choose-as-best`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: user.id.toString(),
        },
      });

      expect(notificationOnDatabase).not.toBeNull();
    });
  });
});
