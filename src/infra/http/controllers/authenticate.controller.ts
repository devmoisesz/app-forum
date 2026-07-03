import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Post,
    UnauthorizedException,
    UsePipes,
} from "@nestjs/common";
import { z } from 'zod';
import { ZodValidationPipes } from "../pipes/zod-validation-pipe";
import { AuthenticateStudentUseCase } from "@/src/domain/forum/application/use-cases/authenticate-student";
import { WrongCredentialsError } from "@/src/domain/forum/application/use-cases/errors/wrong-credentials-error";
import { Public } from "../../auth/public";

export const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller("/sessions")
@Public()
export class AuthenticateController {
  constructor(
    private authenticateStudent: AuthenticateStudentUseCase,
) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipes(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateStudent.execute({
        email,
        password
    })

    if(result.isLeft()) {
        const error = result.value

        switch(error.constructor){
            case WrongCredentialsError:
                throw new UnauthorizedException(error.message)
            default: 
                throw new BadRequestException(error.message)
        }
    }

    const { accessToken } = result.value

    return {
        access_token: accessToken
    }
  }
}
