import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { ListRecentQuestionsController } from "./controllers/list-recent-questions.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    ListRecentQuestionsController,
  ],
  providers: [PrismaService]
})
export class HttpModule {}
