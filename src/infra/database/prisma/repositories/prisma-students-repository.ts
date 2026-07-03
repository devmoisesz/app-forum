import { StudentsRepository } from "@/src/domain/forum/application/repositories/students-repository"
import { Student } from "@/src/domain/forum/enterprise/entities/student";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaStudentMapper } from "../mappers/prisma-student-mapper";

@Injectable()
export class PrismaStudentRepository implements StudentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!student) return null;

    return PrismaStudentMapper.toDomain(student)
  }

  async create(student: Student) {
    const data = PrismaStudentMapper.toPrisma(student)

    await this.prisma.user.create({
        data,
    })
  }
}
