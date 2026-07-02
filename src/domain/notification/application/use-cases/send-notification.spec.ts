import { InMemoryNotificationRepository } from "@/test/repositories-in-memory/in-memory-notification-repository";
import { SendNotificationUseCase } from "./send-notification";

let notificationRepository: InMemoryNotificationRepository;
let sendNotificationUseCase: SendNotificationUseCase;

describe("Send Notification", () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository();
    sendNotificationUseCase = new SendNotificationUseCase(notificationRepository);
  });

  it("should be able to send notification", async () => {
    const result = await sendNotificationUseCase.execute({
      recipientId: "1",
      title: "new notification",
      content: "congratulations",
    });

    expect(result.isRight()).toBe(true);
    expect(notificationRepository.items[0]).toEqual(result.value?.notification);
  });
});
