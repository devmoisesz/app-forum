import { Either, right } from "@/src/core/either";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationRepository } from "../repositories/notification-repository";
import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";

export interface SendNotificationUseCaseRequest {
  recipientId: string
  title: string
  content: string
}

export type SendNotificationUseCaseResponse = Either<
null,
{
  notification: Notification
}
>

@Injectable()
export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
        recipientId: new UniqueEntityID(recipientId),
        title,
        content,
    })

    await this.notificationsRepository.create(notification)

    return right({
        notification
    })
  }
}
