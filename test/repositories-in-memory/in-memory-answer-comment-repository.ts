import { AnswerComment } from "@/src/domain/forum/enterprise/entities/answer-comment";
import type { AnswerCommentRepository } from "../../src/domain/forum/application/repositories/answer-comment-repository";
import { PaginationParams } from "@/src/core/repositories/pagination-params";
import { DomainEvents } from "@/src/core/events/domain-events";


export class InMemoryAnswerCommentRepository implements AnswerCommentRepository {
  public items: AnswerComment[] = [];

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);

    return answerComments;
  }

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id);

    if (!answerComment) return null;

    return answerComment;
  }
  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    );

    this.items.splice(itemIndex, 1);
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);

    DomainEvents.dispatchEventsForAggregate(answerComment.id);
  }
}
