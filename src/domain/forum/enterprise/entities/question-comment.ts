import type { Optional } from '../../../../core/types/optional'
import { Comment } from './comment'
import type { CommentProps } from './comment'
import { QuestionCommentCreatedEvent } from '../../events/question-comment-created'
import { UniqueEntityID } from '@/src/core/entities/unique-entity-id'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityID
}

export class QuestionComment extends Comment<QuestionCommentProps> {

    get questionId(){
        return this.props.questionId
    }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewQuestionComment = !id

    if(isNewQuestionComment) {
      questionComment.addDomainEvent(new QuestionCommentCreatedEvent(questionComment))
    }

    return questionComment
  }
}

