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
import { EditQuestionController } from "./controllers/edit-question.controller";
import { EditQuestionUseCase } from "@/src/domain/forum/application/use-cases/edit-question";
import { DeleteQuestionController } from "./controllers/delete-question.controller";
import { DeleteQuestionUseCase } from "@/src/domain/forum/application/use-cases/delete-question";
import { AnswerQuestionController } from "./controllers/answer-question.controller";
import { AnswerQuestionUseCase } from "@/src/domain/forum/application/use-cases/answer-question";
import { EditAnswerController } from "./controllers/edit-answer.controller";
import { EditAnswerUseCase } from "@/src/domain/forum/application/use-cases/edit-answer";
import { DeleteAnswerController } from "./controllers/delete-answer.controller";
import { DeleteAnswerUseCase } from "@/src/domain/forum/application/use-cases/delete-answer";
import { ListAnswersOfQuestionController } from "./controllers/list-answers-question.controller";
import { ListAnswersOfQuestionUseCase } from "@/src/domain/forum/application/use-cases/list-answers-question";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    ListRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    ListAnswersOfQuestionController
  ],
  providers: [
    CreateQuestionUseCase,
    AuthenticateStudentUseCase,
    ListRecentQuestionsUseCase,
    RegisterStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    ListAnswersOfQuestionUseCase
  ],
})
export class HttpModule {}
