import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../app.module";
import { StudentFactory } from "@/test/factories/make-student";
import { DatabaseModule } from "../../database/database.module";
import { PrismaService } from "../../database/prisma/prisma.service";
import { QuestionFactory } from "@/test/factories/make-question";

describe("Comment on question (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService
  let questionFactory: QuestionFactory
  let studentFactory: StudentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init();
  });

  test("[POST] /questions/:questionId/comments", async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
        authorId: user.id
    })

    const questionId = question.id.toString()

    const response = await request(app.getHttpServer())
      .post(`/questions/${questionId}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "comment",
      });

    expect(response.statusCode).toBe(201);

    const commentOnDatebase = await prisma.comment.findFirst({
      where: {
        content: "comment",
      },
    });

    expect(commentOnDatebase).toBeTruthy();
  });
});
