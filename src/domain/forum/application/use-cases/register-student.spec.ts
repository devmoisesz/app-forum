import { RegisterStudentUseCase } from "./register-student";
import { InMemoryStudentRepositoty } from "@/test/repositories-in-memory/in-memory-student-repository";
import { FakeHasher } from "@/test/cryptography/fake-hasher";

let studentRepository: InMemoryStudentRepositoty;
let fakeHasher: FakeHasher;
let registerStudentUseCase: RegisterStudentUseCase;

describe("Register Student", () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepositoty();
    fakeHasher = new FakeHasher();

    registerStudentUseCase = new RegisterStudentUseCase(
      studentRepository,
      fakeHasher,
    );
  });

  it("should be able to register student", async () => {
    const result = await registerStudentUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
        student: studentRepository.items[0]
    })
  });

  it("should hash student password upon registration", async () => {
    const result = await registerStudentUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true);
    expect(studentRepository.items[0].password).toEqual(hashedPassword)
  });
});
