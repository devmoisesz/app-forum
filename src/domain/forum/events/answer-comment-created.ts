import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";
import type { AnswerComment } from "../enterprise/entities/answer-comment";
import { DomainEvent } from "@/src/core/events/domain-event";

export class AnswerCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date;

  constructor(
    public answerComment: AnswerComment,
  ) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.answerComment.answerId;
  }
}