import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { PrismaService } from "../../database/prisma/prisma.service";
import { AppModule } from "../../app.module";

describe("List recent questions (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService)

    await app.init();
  });

  test("[GET] /questions", async () => {
    const user = await prisma.user.create({
      data: {
        name: "John doe",
        email: "john@example.com",
        password: "123456"
      },
    });

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
        data: [
            {
                title: 'question 1',
                slug: 'question-1',
                content: 'content',
                authorId: user.id
            },
            {
                title: 'question 2',
                slug: 'question-2',
                content: 'content',
                authorId: user.id
            },
            {
                title: 'question 3',
                slug: 'question-3',
                content: 'content',
                authorId: user.id
            },
        ]
    })

    const response = await request(app.getHttpServer())
      .get("/questions")
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
        questions: [
            expect.objectContaining({title: 'question 1'}),
            expect.objectContaining({title: 'question 2'}),
            expect.objectContaining({title: 'question 3'}),
        ]
    })
  });
});
