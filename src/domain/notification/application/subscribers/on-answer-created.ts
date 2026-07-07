import { QuestionsRepository } from "@/src/domain/forum/application/repositories/question-repository";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { EventHandler } from "@/src/core/events/event-handler";
import { DomainEvents } from "@/src/core/events/domain-events";
import { AnswerCreatedEvent } from "@/src/domain/forum/events/answer-created-event";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    );
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    );

    if(question){
        await this.sendNotification.execute({
            recipientId: question.authorId.toString(),
            title: `New answer in "${question.title.substring(0, 40).concat('...')}"`,
            content: answer.excerpt,
        })
    }

  }
}
