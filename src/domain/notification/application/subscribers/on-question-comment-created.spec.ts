import { MockInstance } from "vitest"
import { SendNotificationUseCase, SendNotificationUseCaseRequest, SendNotificationUseCaseResponse } from "../use-cases/send-notification"
import { InMemoryQuestionAttachmentRepository } from "@/test/repositories-in-memory/in-memory-question-attachments-repository"
import { InMemoryNotificationRepository } from "@/test/repositories-in-memory/in-memory-notification-repository"
import { InMemoryAnswerAttachmentRepository } from "@/test/repositories-in-memory/in-memory-answer-attachments-repository"
import { InMemoryQuestionRepository } from "@/test/repositories-in-memory/in-memory-questions-repository"
import { InMemoryQuestionCommentRepository } from "@/test/repositories-in-memory/in-memory-question-comment-repository"
import { OnQuestionCommentCreated } from "./on-question-comment-created"
import { makeQuestion } from "@/test/factories/make-question"
import { makeQuestionComment } from "@/test/factories/make-question-comment"
import { waitFor } from "@/test/utils/wait-for"


let questionsAttachmentRepository: InMemoryQuestionAttachmentRepository
let questionsRepository: InMemoryQuestionRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentRepository
let questionCommentRepository: InMemoryQuestionCommentRepository
let notificationRepository: InMemoryNotificationRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
    (
        request: SendNotificationUseCaseRequest,
    ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Question Comment Created', () => {
    beforeEach(() => {
        questionsAttachmentRepository = new InMemoryQuestionAttachmentRepository()
        questionsRepository = new InMemoryQuestionRepository(questionsAttachmentRepository)
        answerAttachmentsRepository = new InMemoryAnswerAttachmentRepository()
        questionCommentRepository = new InMemoryQuestionCommentRepository()
        notificationRepository = new InMemoryNotificationRepository()
        sendNotificationUseCase = new SendNotificationUseCase(notificationRepository)

        sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

        new OnQuestionCommentCreated(questionCommentRepository, questionsRepository,sendNotificationUseCase)
    })
    it('should send a notification when an question receives a comment', async () => {
        const question = makeQuestion()
        const questionComment = makeQuestionComment({questionId: question.id})

        questionsRepository.create(question)
        questionCommentRepository.create(questionComment)
        

        await waitFor(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled()
        })
    })
})