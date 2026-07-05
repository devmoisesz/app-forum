import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../app.module";
import { StudentFactory } from "@/test/factories/make-student";
import { DatabaseModule } from "../../database/database.module";
import { PrismaService } from "../../database/prisma/prisma.service";
import { QuestionFactory } from "@/test/factories/make-question";
import { AnswerFactory } from "@/test/factories/make-answer";

describe("Edit Answer (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let studentFactory: StudentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    prisma = moduleRef.get(PrismaService)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init();
  });

  test("[PUT] /answers/:id", async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
        authorId: user.id
    })

    const answer = await answerFactory.makePrismaAnswer({
        questionId: question.id,
        authorId: user.id
    })

    const answerId = answer.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/answers/${answerId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "new content",
      });

    expect(response.statusCode).toBe(204);

    const answerOnDatebase = await prisma.answer.findFirst({
      where: {
        content: "new content",
      },
    });

    expect(answerOnDatebase).toBeTruthy();
  });
});
