import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { ListRecentQuestionsController } from "./controllers/list-recent-questions.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { DatabaseModule } from "../database/database.module";
import { CreateQuestionUseCase } from "@/src/domain/forum/application/use-cases/create-question";
import { ListRecentQuestionsUseCase } from "@/src/domain/forum/application/use-cases/list-recent-questions";

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    ListRecentQuestionsController,
  ],
  providers: [CreateQuestionUseCase, ListRecentQuestionsUseCase],
})
export class HttpModule {}
