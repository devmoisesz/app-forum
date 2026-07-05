import { DomainEvents } from "@/src/core/events/domain-events";
import { AttachmentsRepository } from "@/src/domain/forum/application/repositories/attachments-repository";
import { Attachment } from "@/src/domain/forum/enterprise/entities/attachment";


export class InMemoryAttachmenttRepository implements AttachmentsRepository {
  public items: Attachment[] = [];

  async create(attachmentt: Attachment) {
    this.items.push(attachmentt)
  }
}
