import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { ListRecentQuestionsController } from "./controllers/list-recent-questions.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { DatabaseModule } from "../database/database.module";
import { CreateQuestionUseCase } from "@/src/domain/forum/application/use-cases/create-question";
import { ListRecentQuestionsUseCase } from "@/src/domain/forum/application/use-cases/list-recent-questions";
import { AuthenticateStudentUseCase } from "@/src/domain/forum/application/use-cases/authenticate-student";
import { RegisterStudentUseCase } from "@/src/domain/forum/application/use-cases/register-student";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { GetQuestionBySlugController } from "./controllers/get-queston-by-slug.controller";
import { GetQuestionBySlugUseCase } from "@/src/domain/forum/application/use-cases/get-question-by-slug";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    ListRecentQuestionsController,
    GetQuestionBySlugController
  ],
  providers: [
    CreateQuestionUseCase,
    AuthenticateStudentUseCase,
    ListRecentQuestionsUseCase,
    RegisterStudentUseCase,
    GetQuestionBySlugUseCase
  ],
})
export class HttpModule {}
