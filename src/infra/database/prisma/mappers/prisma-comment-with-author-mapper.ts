import { UniqueEntityID } from "@/src/core/entities/unique-entity-id";
import { CommentWithAuthor } from "@/src/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { Comment as PrismaComment, User as PrismaUser } from "@prisma/client";

type PrismaCommentWithAuthor = PrismaComment & {
    author: PrismaUser
}

export class PrismaCommentWithAuthorMapper {
    static toDomain(raw: any): CommentWithAuthor {
        return CommentWithAuthor.create({
            commentId: new UniqueEntityID(raw.id),
            authorId: new UniqueEntityID(raw.authorId),
            author: raw.author.name,
            content: raw.content,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        })
    }
}