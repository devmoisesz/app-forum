import type { Question } from "../enterprise/entities/question";
import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";
import { DomainEvent } from "@/src/core/events/domain-event";

export class QuestionBestAnswerChosenEvent implements DomainEvent {
    public ocurredAt: Date
    public question: Question
    public bestAnswerId: UniqueEntityID

    constructor(question: Question, bestAnswerId: UniqueEntityID){
        this.question = question
        this.bestAnswerId = bestAnswerId
        this.ocurredAt = new Date()
    }

    getAggregateId(): UniqueEntityID {
        return this.question.id
    }
    
}