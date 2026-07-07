import { Notification } from "../../enterprise/entities/notification";
import { NotificationRepository } from "../repositories/notification-repository";
import { Either, left, right } from "@/src/core/either";
import { NotAllowedError } from "@/src/core/error/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/src/core/error/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";


interface ReadNotificationUseCaseRequest {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification;
  }
>;

@Injectable()
export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationRepository) {}

  async execute({
    recipientId,
    notificationId
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (recipientId != notification.recipientId.toString()) {
      return left(new NotAllowedError());
    }

    notification.read()

    await this.notificationsRepository.save(notification);

    return right({
      notification,
    });
  }
}
