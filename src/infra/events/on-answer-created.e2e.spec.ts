import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { StudentFactory } from "@/test/factories/make-student";
import { QuestionFactory } from "@/test/factories/make-question";
import { PrismaService } from "../database/prisma/prisma.service";
import { DatabaseModule } from "../database/database.module";
import { AppModule } from "../app.module";
import { waitFor } from "@/test/utils/wait-for";
import { DomainEvents } from "@/src/core/events/domain-events";

describe("On Answer created (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService
  let questionFactory: QuestionFactory
  let studentFactory: StudentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory ]
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    prisma = moduleRef.get(PrismaService)

    DomainEvents.shouldRun = true

    await app.init();
  });

  it("should send a notification when answer is created", async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
        authorId: user.id
    })

    const questionId = question.id.toString()

    await request(app.getHttpServer())
      .post(`/questions/${questionId}/answers`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "content",
        attachments: []
      });


    await waitFor(async () => {
        const notificationOnDatabase = await prisma.notification.findFirst({
            where: {
                recipientId: user.id.toString()
            }
        })

        expect(notificationOnDatabase).not.toBeNull()
    })
  });
});
