import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";
import { DomainEvent } from "@/src/core/events/domain-event";
import type { QuestionComment } from "../enterprise/entities/question-comment";

export class QuestionCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date;

  constructor(
    public questionComment: QuestionComment,
  ) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.questionComment.questionId;
  }
}