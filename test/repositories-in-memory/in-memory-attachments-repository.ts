import { AttachmentsRepository } from "@/src/domain/forum/application/repositories/attachments-repository";
import { Attachment } from "@/src/domain/forum/enterprise/entities/attachment";


export class InMemoryAttachmentRepository implements AttachmentsRepository {
  public items: Attachment[] = [];

  async create(attachmentt: Attachment) {
    this.items.push(attachmentt)
  }
}
