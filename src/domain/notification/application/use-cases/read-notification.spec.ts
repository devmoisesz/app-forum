import { InMemoryNotificationRepository } from "@/test/repositories-in-memory/in-memory-notification-repository";
import { ReadNotificationUseCase } from "./read-notification";
import { makeNotification } from "@/test/factories/make-notification";
import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";
import { NotAllowedError } from "@/src/core/error/errors/not-allowed-error";

let notificationRepository: InMemoryNotificationRepository;
let readNotificationUseCase: ReadNotificationUseCase;

describe("Read Notification", () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository();
    readNotificationUseCase = new ReadNotificationUseCase(notificationRepository);
  });

  it("should be able to read a notification", async () => {
    const notification = makeNotification()

    await notificationRepository.create(notification)

    const result = await readNotificationUseCase.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString()
    });

    expect(result.isRight()).toBe(true);
    expect(notificationRepository.items[0]?.readAt).toEqual(
        expect.any(Date)
    );
  });

  it("should not be able to read notification from another user", async () => {
    const notification = makeNotification({
        recipientId: new UniqueEntityID('1')
    })

    await notificationRepository.create(notification)

    const result = await readNotificationUseCase.execute({
      recipientId: '2',
      notificationId: notification.id.toString()
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError)
  });
});
