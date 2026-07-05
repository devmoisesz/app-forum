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

describe("Delete answer (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService
  let questionFactory: QuestionFactory
  let studentFactory: StudentFactory;
  let answerFactory: AnswerFactory
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
    answerFactory = moduleRef.get(AnswerFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init();
  });

  test("[DELETE] /answers/:id", async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
        authorId: user.id
    })

    const answer = await answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id
    })

    const answerId = answer.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/answers/${answerId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const answerOnDatebase = await prisma.answer.findUnique({
      where: {
        id: answerId
      },
    });

    expect(answerOnDatebase).toBeNull();
  });
});
